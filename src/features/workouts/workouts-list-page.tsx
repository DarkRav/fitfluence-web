"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import {
  createInfluencerWorkoutTemplate,
  deleteInfluencerWorkoutTemplate,
  searchInfluencerWorkoutTemplates,
  updateInfluencerWorkoutTemplate,
  type InfluencerWorkoutTemplateRecord,
} from "@/api/influencerWorkouts";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { WorkoutFormDialog } from "@/features/workouts/workout-form-dialog";
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
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function WorkoutsListPage({ programId, programVersionId }: WorkoutsListPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<InfluencerWorkoutTemplateRecord | null>(
    null,
  );
  const [deleteWorkout, setDeleteWorkout] = useState<InfluencerWorkoutTemplateRecord | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const queryKey = useMemo(
    () => ["workouts", programVersionId, page, REFERENCE_LIST_PAGE_SIZE, debouncedSearch] as const,
    [debouncedSearch, page, programVersionId],
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await searchInfluencerWorkoutTemplates({
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
    mutationFn: async (payload: Parameters<typeof createInfluencerWorkoutTemplate>[1]) => {
      const result = await createInfluencerWorkoutTemplate(programVersionId, payload);
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
      await queryClient.invalidateQueries({ queryKey: ["workouts", programVersionId] });
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
      payload: Parameters<typeof updateInfluencerWorkoutTemplate>[1];
    }) => {
      const result = await updateInfluencerWorkoutTemplate(workoutTemplateId, payload);
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
      await queryClient.invalidateQueries({ queryKey: ["workouts", programVersionId] });
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
      const result = await deleteInfluencerWorkoutTemplate(workoutTemplateId);
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
      await queryClient.invalidateQueries({ queryKey: ["workouts", programVersionId] });
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
      <PageHeader
        title="Workouts"
        subtitle="Управление workout templates внутри версии программы."
        actions={
          <div className="flex w-full max-w-4xl items-center gap-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workouts"
            />
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
                              `/influencer/programs/${programId}/versions/${programVersionId}/workouts/${workout.id}`,
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
        onUpdate={async () => {
          throw new Error("Unexpected update in create mode");
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
        onCreate={async () => {
          throw new Error("Unexpected create in edit mode");
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
