"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { adminWorkoutScope } from "@/features/workouts/scopes/adminWorkoutScope";
import { influencerWorkoutScope } from "@/features/workouts/scopes/influencerWorkoutScope";
import {
  type WorkoutExerciseRecord,
  type WorkoutsScope,
  type WorkoutsScopeConfig,
} from "@/features/workouts/types";
import { AddExerciseDialog } from "@/features/workouts/add-exercise-dialog";
import { ReorderableExercisesList } from "@/features/workouts/reorderable-exercises-list";
import { WorkoutExerciseEditor } from "@/features/workouts/workout-exercise-editor";
import { ru } from "@/localization/ru";
import { AppButton, ErrorState, LoadingState, PageHeader, useAppToast } from "@/shared/ui";

type WorkoutDetailsPageProps = {
  programId: string;
  programVersionId: string;
  workoutTemplateId: string;
  scopeName: WorkoutsScope;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function WorkoutDetailsPage({
  programId,
  programVersionId,
  workoutTemplateId,
  scopeName,
}: WorkoutDetailsPageProps) {
  const scope: WorkoutsScopeConfig =
    scopeName === "admin" ? adminWorkoutScope : influencerWorkoutScope;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [localExercises, setLocalExercises] = useState<WorkoutExerciseRecord[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const detailsQuery = useQuery({
    queryKey: [...scope.queryKeys.details, workoutTemplateId],
    queryFn: async () => {
      const result = await scope.api.getWorkout(programVersionId, workoutTemplateId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: async (payload: Parameters<WorkoutsScopeConfig["api"]["addExercise"]>[1]) => {
      const result = await scope.api.addExercise(workoutTemplateId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: ru.workouts.exerciseAdded,
        description: ru.workouts.exerciseAdded,
      });
      setAddExerciseOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...scope.queryKeys.details, workoutTemplateId],
        }),
        queryClient.invalidateQueries({ queryKey: [...scope.queryKeys.list, programVersionId] }),
      ]);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.exerciseAddError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.exerciseAddError,
        description: message,
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({
      nextExercises,
    }: {
      nextExercises: ReturnType<typeof getSortedExercisesForState>;
      previousExercises: ReturnType<typeof getSortedExercisesForState>;
    }) => {
      const result = await scope.api.reorderExercises(
        workoutTemplateId,
        nextExercises.map((item, index) => ({
          exerciseTemplateId: item.id,
          orderIndex: index,
        })),
      );
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.details, workoutTemplateId],
      });
    },
    onError: (error, variables) => {
      setLocalExercises(variables.previousExercises);
      const message = error instanceof Error ? error.message : ru.workouts.reorderError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.reorderError,
        description: message,
      });
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: async ({
      exerciseTemplateId,
      payload,
    }: {
      exerciseTemplateId: string;
      payload: Parameters<WorkoutsScopeConfig["api"]["updateExercise"]>[1];
    }) => {
      const result = await scope.api.updateExercise(exerciseTemplateId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: ru.workouts.exerciseUpdated,
        description: ru.workouts.exerciseUpdated,
      });
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.details, workoutTemplateId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.exerciseUpdateError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.exerciseUpdateError,
        description: message,
      });
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseTemplateId: string) => {
      const result = await scope.api.deleteExercise(exerciseTemplateId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: ru.workouts.exerciseRemoved,
        description: ru.workouts.exerciseRemoved,
      });
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.details, workoutTemplateId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.workouts.exerciseDeleteError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.workouts.exerciseDeleteError,
        description: message,
      });
    },
  });

  useEffect(() => {
    if (!detailsQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: isForbiddenMessage(detailsQuery.error.message)
        ? ru.common.states.notPermitted
        : ru.workouts.detailsLoadError,
      description: detailsQuery.error.message,
    });
  }, [detailsQuery.error, detailsQuery.isError, pushToast]);

  useEffect(() => {
    if (!detailsQuery.data) {
      return;
    }

    const nextExercises = getSortedExercisesForState(detailsQuery.data.exercises);
    setLocalExercises(nextExercises);
    if (!selectedExerciseId && nextExercises.length > 0) {
      setSelectedExerciseId(nextExercises[0]?.id ?? null);
      return;
    }

    if (selectedExerciseId && !nextExercises.some((item) => item.id === selectedExerciseId)) {
      setSelectedExerciseId(nextExercises[0]?.id ?? null);
    }
  }, [detailsQuery.data, selectedExerciseId]);

  if (detailsQuery.isLoading) {
    return <LoadingState title={ru.workouts.detailsLoadError} />;
  }

  if (detailsQuery.isError) {
    return (
      <ErrorState
        title={ru.workouts.detailsLoadError}
        description={detailsQuery.error.message}
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  const workout = detailsQuery.data;
  if (!workout) {
    return (
      <ErrorState
        title={ru.workouts.detailsNotFound}
        description={ru.workouts.detailsEmptyServer}
      />
    );
  }

  const selectedExercise =
    localExercises.find((exercise) => exercise.id === selectedExerciseId) ?? null;

  return (
    <div className="space-y-4">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          {ru.common.labels.programs}
        </Link>
        {" / "}
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          {ru.common.labels.program}
        </Link>
        {" / "}
        <Link
          className="hover:text-secondary"
          href={scope.routes.workoutsList(programId, programVersionId)}
        >
          {ru.common.labels.workouts}
        </Link>
        {" / "}
        <span className="text-foreground">
          {workout.title?.trim() || ru.workouts.workoutBreadcrumbFallback}
        </span>
      </div>

      <PageHeader
        title={workout.title ?? `${ru.common.labels.dayOrder} ${workout.dayOrder}`}
        subtitle={ru.workouts.detailsSubtitle
          .replace("{programId}", programId)
          .replace("{programVersionId}", programVersionId)}
        actions={
          <AppButton
            type="button"
            variant="secondary"
            onClick={() => router.push(scope.routes.workoutsList(programId, programVersionId))}
          >
            {ru.workouts.backToWorkouts}
          </AppButton>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-sidebar/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {ru.common.labels.dayOrder}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">{workout.dayOrder}</p>
          </div>
          <div className="rounded-xl border border-border bg-sidebar/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {ru.common.labels.coachNote}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {workout.coachNote ?? ru.common.states.dash}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{ru.common.labels.exercises}</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {workout.exercises.length} {ru.workouts.exerciseCount}
            </p>
            <AppButton type="button" onClick={() => setAddExerciseOpen(true)}>
              {ru.common.actions.addExercise}
            </AppButton>
          </div>
        </div>

        {workout.exercises.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-sidebar/40 px-4 py-6 text-sm text-muted-foreground">
            {ru.workouts.noExercises}
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-3">
              <ReorderableExercisesList
                exercises={localExercises}
                isReordering={reorderMutation.isPending}
                onReorder={(nextExercises) => {
                  const previousExercises = localExercises;
                  setLocalExercises(nextExercises);
                  reorderMutation.mutate({ nextExercises, previousExercises });
                }}
                renderExercise={(exercise) => {
                  const isSelected = selectedExerciseId === exercise.id;
                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => setSelectedExerciseId(exercise.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "bg-secondary/15 text-foreground"
                          : "bg-card text-foreground hover:bg-secondary/10"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{exercise.exerciseName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {ru.common.labels.sets}: {exercise.sets} · {ru.common.labels.repsMin}/
                          {ru.common.labels.repsMax}: {exercise.repsMin ?? ru.common.states.dash}/
                          {exercise.repsMax ?? ru.common.states.dash} ·{" "}
                          {ru.common.labels.restSeconds}:{" "}
                          {exercise.restSeconds ?? ru.common.states.dash}
                        </p>
                      </div>
                      <div className="ml-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span>{exercise.orderIndex + 1}</span>
                      </div>
                    </button>
                  );
                }}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-20 space-y-3 rounded-xl border border-border bg-sidebar/30 p-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {ru.workouts.exerciseSettingsTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {ru.workouts.exerciseSettingsSubtitle}
                  </p>
                </div>
                {selectedExercise ? (
                  <WorkoutExerciseEditor
                    exercise={selectedExercise}
                    isSubmitting={updateExerciseMutation.isPending}
                    isDeleting={deleteExerciseMutation.isPending}
                    onSave={async (exerciseTemplateId, payload) => {
                      await updateExerciseMutation.mutateAsync({ exerciseTemplateId, payload });
                    }}
                    onDelete={async (exerciseTemplateId) => {
                      await deleteExerciseMutation.mutateAsync(exerciseTemplateId);
                    }}
                  />
                ) : (
                  <p className="rounded-md border border-dashed border-border bg-card px-3 py-4 text-sm text-muted-foreground">
                    {ru.workouts.selectExerciseToEdit}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AddExerciseDialog
        scope={scope}
        open={addExerciseOpen}
        isSubmitting={addExerciseMutation.isPending}
        existingExerciseIds={workout.exercises.map((item) => item.exerciseId)}
        onOpenChange={setAddExerciseOpen}
        onSubmit={async (payload) => addExerciseMutation.mutateAsync(payload)}
      />
    </div>
  );
}

function getSortedExercisesForState(exercises: WorkoutExerciseRecord[]): WorkoutExerciseRecord[] {
  return [...exercises].sort((left, right) => left.orderIndex - right.orderIndex);
}
