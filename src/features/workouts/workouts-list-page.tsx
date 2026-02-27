"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { adminWorkoutScope } from "@/features/workouts/scopes/adminWorkoutScope";
import { influencerWorkoutScope } from "@/features/workouts/scopes/influencerWorkoutScope";
import { WorkoutFormDialog } from "@/features/workouts/workout-form-dialog";
import type {
  WorkoutTemplateRecord,
  WorkoutsScope,
  WorkoutsScopeConfig,
} from "@/features/workouts/types";
import {
  AppButton,
  AppInput,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

type WorkoutsListPageProps = {
  programId: string;
  programVersionId: string;
  scopeName: WorkoutsScope;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

function resolveScope(scopeName: WorkoutsScope): WorkoutsScopeConfig {
  return scopeName === "admin" ? adminWorkoutScope : influencerWorkoutScope;
}

export function WorkoutsListPage({
  programId,
  programVersionId,
  scopeName,
}: WorkoutsListPageProps) {
  const scope = resolveScope(scopeName);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutTemplateRecord | null>(null);
  const [deleteWorkout, setDeleteWorkout] = useState<WorkoutTemplateRecord | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const queryKey = useMemo(
    () =>
      [
        ...scope.queryKeys.list,
        programVersionId,
        page,
        REFERENCE_LIST_PAGE_SIZE,
        debouncedSearch,
      ] as const,
    [debouncedSearch, page, programVersionId, scope.queryKeys.list],
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await scope.api.listWorkouts({
        programVersionId,
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search: debouncedSearch,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!listQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: isForbiddenMessage(listQuery.error.message)
        ? "Not permitted"
        : "Не удалось загрузить workouts",
      description: listQuery.error.message,
    });
  }, [listQuery.error, listQuery.isError, pushToast]);

  const createMutation = useMutation({
    mutationFn: async (payload: Parameters<WorkoutsScopeConfig["api"]["createWorkout"]>[1]) => {
      const result = await scope.api.createWorkout(programVersionId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Workout создан",
        description: "Template успешно добавлен в версию программы.",
      });
      setCreateOpen(false);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось создать workout";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка создания",
        description: message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      workoutTemplateId,
      payload,
    }: {
      workoutTemplateId: string;
      payload: Parameters<WorkoutsScopeConfig["api"]["updateWorkout"]>[1];
    }) => {
      const result = await scope.api.updateWorkout(workoutTemplateId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Workout обновлен",
        description: "Изменения сохранены.",
      });
      setEditingWorkout(null);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось обновить workout";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка сохранения",
        description: message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (workoutTemplateId: string) => {
      const result = await scope.api.deleteWorkout(workoutTemplateId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Workout удален",
        description: "Template удален из версии программы.",
      });
      setDeleteWorkout(null);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось удалить workout";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка удаления",
        description: message,
      });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;

  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          Programs
        </Link>
        {" / "}
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          Program
        </Link>
        {" / "}
        <span>Version</span>
        {" / "}
        <span className="text-foreground">Workouts</span>
      </div>

      <PageHeader
        title="Version Workouts"
        subtitle="Управление workout templates для выбранной версии программы."
        actions={
          <div className="flex w-full max-w-4xl flex-wrap items-center gap-2">
            <div className="min-w-[220px] flex-1">
              <AppInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search workouts"
              />
            </div>
            <AppButton
              type="button"
              variant="secondary"
              onClick={() => router.push(scope.routes.programDetails(programId))}
            >
              Back to Program
            </AppButton>
            <AppButton type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create workout
            </AppButton>
          </div>
        }
      />

      {listQuery.isLoading ? <LoadingState title="Загружаем workouts..." /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить workouts"
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && (listQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Workouts не найдены"
          description="Создайте первый workout template для этой версии."
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sidebar/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Day</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Exercises</th>
                  <th className="px-4 py-3 font-medium">Coach note</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listQuery.data.items.map((workout) => (
                  <tr
                    key={workout.id}
                    className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
                  >
                    <td className="px-4 py-3 font-medium">Day {workout.dayOrder}</td>
                    <td className="px-4 py-3">{workout.title ?? "Untitled workout"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{workout.exercises.length}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {workout.coachNote ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <AppButton
                          type="button"
                          variant="secondary"
                          className="h-9 px-3 text-xs"
                          onClick={() =>
                            router.push(
                              scope.routes.workoutDetails(programId, programVersionId, workout.id),
                            )
                          }
                        >
                          Open
                        </AppButton>
                        <AppButton
                          type="button"
                          variant="secondary"
                          className="h-9 px-3 text-xs"
                          onClick={() => setEditingWorkout(workout)}
                        >
                          Edit
                        </AppButton>
                        <AppButton
                          type="button"
                          variant="destructive"
                          className="h-9 px-3 text-xs"
                          onClick={() => setDeleteWorkout(workout)}
                        >
                          Delete
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              Страница {listQuery.data.page + 1} / {Math.max(totalPages, 1)} •{" "}
              {listQuery.data.totalElements} элементов
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Вперед
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}

      <WorkoutFormDialog
        open={createOpen}
        mode="create"
        isSubmitting={createMutation.isPending}
        onOpenChange={setCreateOpen}
        onCreate={async (payload) => {
          await createMutation.mutateAsync(payload);
        }}
      />

      <WorkoutFormDialog
        open={Boolean(editingWorkout)}
        mode="edit"
        workout={editingWorkout ?? undefined}
        isSubmitting={updateMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditingWorkout(null);
          }
        }}
        onUpdate={async (workoutTemplateId, payload) => {
          await updateMutation.mutateAsync({ workoutTemplateId, payload });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteWorkout)}
        title="Удалить workout template?"
        description={
          deleteWorkout
            ? `Workout ${deleteWorkout.title ?? deleteWorkout.id} будет удален вместе со всеми упражнениями.`
            : ""
        }
        isSubmitting={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteWorkout(null);
          }
        }}
        onConfirm={() => {
          if (!deleteWorkout) {
            return;
          }

          void deleteMutation.mutateAsync(deleteWorkout.id);
        }}
      />
    </div>
  );
}
