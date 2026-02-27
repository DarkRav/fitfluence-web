"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addExerciseToAdminWorkout, getAdminWorkout } from "@/api/adminWorkouts";
import { AddExerciseDialog } from "@/features/workouts/admin/add-exercise-dialog";
import { WorkoutExercisesList } from "@/features/workouts/admin/workout-exercises-list";
import { AppButton, ErrorState, LoadingState, PageHeader, useAppToast } from "@/shared/ui";

type AdminWorkoutDetailsPageProps = {
  programId: string;
  programVersionId: string;
  workoutTemplateId: string;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function AdminWorkoutDetailsPage({
  programId,
  programVersionId,
  workoutTemplateId,
}: AdminWorkoutDetailsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);

  const detailsQuery = useQuery({
    queryKey: ["adminWorkout", workoutTemplateId],
    queryFn: async () => {
      const result = await getAdminWorkout(programVersionId, workoutTemplateId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: async (payload: Parameters<typeof addExerciseToAdminWorkout>[1]) => {
      const result = await addExerciseToAdminWorkout(workoutTemplateId, payload);
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
        queryClient.invalidateQueries({ queryKey: ["adminWorkout", workoutTemplateId] }),
        queryClient.invalidateQueries({ queryKey: ["adminWorkouts", programVersionId] }),
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
      <PageHeader
        title={workout.title ?? `Workout day ${workout.dayOrder}`}
        subtitle={`Program ${programId} · Version ${programVersionId}`}
        actions={
          <AppButton
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(`/admin/programs/${programId}/versions/${programVersionId}/workouts`)
            }
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
          <WorkoutExercisesList items={workout.exercises} />
        )}
      </div>

      <AddExerciseDialog
        open={addExerciseOpen}
        isSubmitting={addExerciseMutation.isPending}
        existingExerciseIds={workout.exercises.map((item) => item.exerciseId)}
        onOpenChange={setAddExerciseOpen}
        onSubmit={async (payload) => addExerciseMutation.mutateAsync(payload)}
      />
    </div>
  );
}
