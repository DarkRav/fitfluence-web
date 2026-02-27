"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type {
  AdminWorkoutExerciseRecord,
  UpdateAdminWorkoutExercisePayload,
} from "@/api/adminWorkouts";
import { AppButton, AppInput } from "@/shared/ui";

const exerciseEditorSchema = z.object({
  sets: z.number().int().min(1, "Минимум 1 подход"),
  repsMin: z.number().int().min(1).optional(),
  repsMax: z.number().int().min(1).optional(),
  targetRpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type ExerciseEditorValues = z.infer<typeof exerciseEditorSchema>;

type WorkoutExerciseEditorProps = {
  exercise: AdminWorkoutExerciseRecord;
  isSubmitting: boolean;
  isDeleting: boolean;
  onSave: (exerciseTemplateId: string, payload: UpdateAdminWorkoutExercisePayload) => Promise<void>;
  onDelete: (exerciseTemplateId: string) => Promise<void>;
};

function buildDefaultValues(exercise: AdminWorkoutExerciseRecord): ExerciseEditorValues {
  return {
    sets: exercise.sets,
    repsMin: exercise.repsMin,
    repsMax: exercise.repsMax,
    targetRpe: exercise.targetRpe,
    restSeconds: exercise.restSeconds,
    notes: exercise.notes ?? "",
  };
}

export function WorkoutExerciseEditor({
  exercise,
  isSubmitting,
  isDeleting,
  onSave,
  onDelete,
}: WorkoutExerciseEditorProps) {
  const form = useForm<ExerciseEditorValues>({
    resolver: zodResolver(exerciseEditorSchema),
    defaultValues: buildDefaultValues(exercise),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(exercise));
  }, [exercise, form]);

  return (
    <div className="rounded-xl border border-border bg-sidebar/30 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{exercise.exerciseName}</p>
          <p className="text-xs text-muted-foreground">
            {exercise.exerciseCode} · Order {exercise.orderIndex + 1}
          </p>
        </div>
        <AppButton
          type="button"
          variant="destructive"
          className="h-9 px-3 text-xs"
          disabled={isDeleting}
          onClick={() => {
            void onDelete(exercise.id);
          }}
        >
          {isDeleting ? "Removing..." : "Remove"}
        </AppButton>
      </div>

      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          await onSave(exercise.id, {
            sets: values.sets,
            repsMin: values.repsMin,
            repsMax: values.repsMax,
            targetRpe: values.targetRpe,
            restSeconds: values.restSeconds,
            notes: values.notes?.trim() || undefined,
          });
        })}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sets</label>
            <AppInput type="number" min={1} {...form.register("sets", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Reps min</label>
            <AppInput
              type="number"
              min={1}
              {...form.register("repsMin", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Reps max</label>
            <AppInput
              type="number"
              min={1}
              {...form.register("repsMax", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Target RPE</label>
            <AppInput
              type="number"
              min={1}
              max={10}
              step="0.5"
              {...form.register("targetRpe", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Rest seconds</label>
            <AppInput
              type="number"
              min={0}
              {...form.register("restSeconds", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Notes</label>
          <textarea
            {...form.register("notes")}
            className="min-h-16 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
          />
        </div>

        <div className="flex justify-end">
          <AppButton type="submit" disabled={isSubmitting} className="h-9 px-3 text-xs">
            {isSubmitting ? "Saving..." : "Save params"}
          </AppButton>
        </div>
      </form>
    </div>
  );
}
