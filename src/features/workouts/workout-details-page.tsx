"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type WorkoutExerciseRecord, type WorkoutsScopeConfig } from "@/features/workouts/types";
import { AddExerciseDialog } from "@/features/workouts/add-exercise-dialog";
import { ReorderableExercisesList } from "@/features/workouts/reorderable-exercises-list";
import { WorkoutExerciseEditor } from "@/features/workouts/workout-exercise-editor";
import { AppButton, ErrorState, LoadingState, PageHeader, useAppToast } from "@/shared/ui";

type WorkoutDetailsPageProps = {
  programId: string;
  programVersionId: string;
  workoutTemplateId: string;
  scope: WorkoutsScopeConfig;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function WorkoutDetailsPage({
  programId,
  programVersionId,
  workoutTemplateId,
  scope,
}: WorkoutDetailsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [localExercises, setLocalExercises] = useState<WorkoutExerciseRecord[]>([]);

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
        title: "Exercise added",
        description: "Упражнение добавлено в workout.",
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
      const message = error instanceof Error ? error.message : "Не удалось добавить упражнение";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка добавления",
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
      const message = error instanceof Error ? error.message : "Не удалось сохранить порядок";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка reorder",
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
        title: "Exercise updated",
        description: "Параметры упражнения сохранены.",
      });
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.details, workoutTemplateId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось сохранить упражнение";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка сохранения",
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
        title: "Exercise removed",
        description: "Упражнение удалено из workout.",
      });
      await queryClient.invalidateQueries({
        queryKey: [...scope.queryKeys.details, workoutTemplateId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось удалить упражнение";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка удаления",
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
        ? "Not permitted"
        : "Не удалось загрузить workout",
      description: detailsQuery.error.message,
    });
  }, [detailsQuery.error, detailsQuery.isError, pushToast]);

  useEffect(() => {
    if (!detailsQuery.data) {
      return;
    }

    setLocalExercises(getSortedExercisesForState(detailsQuery.data.exercises));
  }, [detailsQuery.data]);

  if (detailsQuery.isLoading) {
    return <LoadingState title="Загружаем workout..." />;
  }

  if (detailsQuery.isError) {
    return (
      <ErrorState
        title="Не удалось загрузить workout"
        description={detailsQuery.error.message}
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  const workout = detailsQuery.data;
  if (!workout) {
    return <ErrorState title="Workout не найден" description="Пустой ответ сервера." />;
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          Programs
        </Link>
        {" / "}
        <Link className="hover:text-secondary" href={scope.routes.programDetails(programId)}>
          Program
        </Link>
        {" / "}
        <Link
          className="hover:text-secondary"
          href={scope.routes.workoutsList(programId, programVersionId)}
        >
          Workouts
        </Link>
        {" / "}
        <span className="text-foreground">Workout</span>
      </div>

      <PageHeader
        title={workout.title ?? `Workout day ${workout.dayOrder}`}
        subtitle={`Program ${programId} · Version ${programVersionId}`}
        actions={
          <AppButton
            type="button"
            variant="secondary"
            onClick={() => router.push(scope.routes.workoutsList(programId, programVersionId))}
          >
            Back to Workouts
          </AppButton>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-sidebar/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Day order</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{workout.dayOrder}</p>
          </div>
          <div className="rounded-xl border border-border bg-sidebar/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Coach note</p>
            <p className="mt-1 text-sm text-foreground">{workout.coachNote ?? "-"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Exercises</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{workout.exercises.length} items</p>
            <AppButton type="button" onClick={() => setAddExerciseOpen(true)}>
              Add exercise
            </AppButton>
          </div>
        </div>

        {workout.exercises.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-sidebar/40 px-4 py-6 text-sm text-muted-foreground">
            В этом workout пока нет упражнений.
          </p>
        ) : (
          <ReorderableExercisesList
            exercises={localExercises}
            isReordering={reorderMutation.isPending}
            onReorder={(nextExercises) => {
              const previousExercises = localExercises;
              setLocalExercises(nextExercises);
              reorderMutation.mutate({ nextExercises, previousExercises });
            }}
            renderExercise={(exercise) => (
              <WorkoutExerciseEditor
                key={exercise.id}
                exercise={exercise}
                isSubmitting={updateExerciseMutation.isPending}
                isDeleting={deleteExerciseMutation.isPending}
                onSave={async (exerciseTemplateId, payload) => {
                  await updateExerciseMutation.mutateAsync({ exerciseTemplateId, payload });
                }}
                onDelete={async (exerciseTemplateId) => {
                  await deleteExerciseMutation.mutateAsync(exerciseTemplateId);
                }}
              />
            )}
          />
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
