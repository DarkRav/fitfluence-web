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
import { ru } from "@/localization/ru";
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
  embedded?: boolean;
  canManage?: boolean;
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
  embedded = false,
  canManage = true,
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
        ? ru.common.states.notPermitted
        : ru.workouts.loadError,
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
        title: ru.workouts.created,
        description: ru.workouts.created,
      });
      setCreateOpen(false);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.createError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.createError,
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
        title: ru.workouts.updated,
        description: ru.workouts.updated,
      });
      setEditingWorkout(null);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.updateError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.updateError,
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
        title: ru.workouts.deleted,
        description: ru.workouts.deleted,
      });
      setDeleteWorkout(null);
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.list, programVersionId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.deleteError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.deleteError,
        description: message,
      });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;

  return (
    <div>
      {!embedded ? (
        <div className="mb-2 text-sm text-muted-foreground">
          <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
            {ru.common.labels.programs}
          </Link>
          {" / "}
          <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
            {ru.common.labels.program}
          </Link>
          {" / "}
          <span className="text-foreground">{ru.common.labels.workouts}</span>
        </div>
      ) : null}

      {embedded ? (
        <div className="mb-4 flex w-full flex-wrap items-center gap-2">
          <div className="min-w-[220px] flex-1">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={ru.common.placeholders.searchWorkouts}
            />
          </div>
          {canManage ? (
            <AppButton type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {ru.workouts.createWorkout}
            </AppButton>
          ) : null}
        </div>
      ) : (
        <PageHeader
          title={ru.workouts.listTitle}
          subtitle={ru.workouts.listSubtitle}
          actions={
            <div className="flex w-full flex-wrap items-center gap-2">
              <div className="min-w-[220px] flex-1">
                <AppInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={ru.common.placeholders.searchWorkouts}
                />
              </div>
              <AppButton
                type="button"
                variant="secondary"
                onClick={() => router.push(scope.routes.programDetails(programId))}
              >
                {ru.workouts.backToProgram}
              </AppButton>
              {canManage ? (
                <AppButton type="button" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {ru.workouts.createWorkout}
                </AppButton>
              ) : null}
            </div>
          }
        />
      )}

      {listQuery.isLoading ? <LoadingState title={ru.workouts.loadError} /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title={ru.workouts.loadError}
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && (listQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState title={ru.workouts.emptyTitle} description={ru.workouts.emptyDescription} />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sidebar/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.dayOrder}</th>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.title}</th>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.exercises}</th>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.coachNote}</th>
                  <th className="px-4 py-3 text-right font-medium">{ru.common.labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {listQuery.data.items.map((workout) => (
                  <tr
                    key={workout.id}
                    className="cursor-pointer border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
                    onClick={() =>
                      router.push(
                        scope.routes.workoutDetails(programId, programVersionId, workout.id),
                      )
                    }
                  >
                    <td className="px-4 py-3 font-medium">
                      {ru.common.labels.dayOrder} {workout.dayOrder}
                    </td>
                    <td className="px-4 py-3">{workout.title ?? ru.workouts.unnamedWorkout}</td>
                    <td className="px-4 py-3 text-muted-foreground">{workout.exercises.length}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {workout.coachNote ?? ru.common.states.dash}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <AppButton
                          type="button"
                          variant="secondary"
                          className="h-9 px-3 text-xs"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(
                              scope.routes.workoutDetails(programId, programVersionId, workout.id),
                            );
                          }}
                        >
                          {ru.common.actions.open}
                        </AppButton>
                        {canManage ? (
                          <AppButton
                            type="button"
                            variant="secondary"
                            className="h-9 px-3 text-xs"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingWorkout(workout);
                            }}
                          >
                            {ru.common.actions.edit}
                          </AppButton>
                        ) : null}
                        {canManage ? (
                          <AppButton
                            type="button"
                            variant="destructive"
                            className="h-9 px-3 text-xs"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeleteWorkout(workout);
                            }}
                          >
                            {ru.common.actions.delete}
                          </AppButton>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              {ru.common.labels.page} {listQuery.data.page + 1} / {Math.max(totalPages, 1)} •{" "}
              {listQuery.data.totalElements} {ru.common.labels.elements}
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((previous) => previous - 1)}
              >
                {ru.common.actions.back}
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
              >
                {ru.common.actions.forward}
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}

      {canManage ? (
        <WorkoutFormDialog
          open={createOpen}
          mode="create"
          isSubmitting={createMutation.isPending}
          onOpenChange={setCreateOpen}
          onCreate={async (payload) => {
            await createMutation.mutateAsync(payload);
          }}
        />
      ) : null}

      {canManage ? (
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
      ) : null}

      {canManage ? (
        <ConfirmDeleteDialog
          open={Boolean(deleteWorkout)}
          title={ru.workouts.deleteConfirmTitle}
          description={deleteWorkout ? ru.workouts.deleteConfirmDescription : ""}
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
      ) : null}
    </div>
  );
}
