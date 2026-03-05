"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogRoot,
  AppDialogTitle,
} from "@/components/ui";
import {
  type AddAdminWorkoutExercisePayload,
  type AdminWorkoutExerciseRecord,
} from "@/api/adminWorkouts";
import { searchAdminExercises } from "@/api/adminExercises";
import { ru } from "@/localization/ru";
import { AppButton, AppInput, AppTextarea } from "@/shared/ui";

const addExerciseSchema = z.object({
  exerciseId: z.string().trim().min(1, ru.workouts.selectExerciseValidation),
  sets: z.number().int().min(1, ru.workouts.minSetsValidation),
  repsMin: z.number().int().min(1).optional(),
  repsMax: z.number().int().min(1).optional(),
  targetRpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type AddExerciseValues = z.infer<typeof addExerciseSchema>;

type AddExerciseDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  existingExerciseIds: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AddAdminWorkoutExercisePayload) => Promise<AdminWorkoutExerciseRecord>;
};

export function AddExerciseDialog({
  open,
  isSubmitting,
  existingExerciseIds,
  onOpenChange,
  onSubmit,
}: AddExerciseDialogProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const exercisesQuery = useQuery({
    queryKey: ["admin-workout-add-exercise", debouncedSearch],
    enabled: open,
    queryFn: async () => {
      const result = await searchAdminExercises({
        page: 0,
        size: 30,
        search: debouncedSearch,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data.items;
    },
  });

  const form = useForm<AddExerciseValues>({
    resolver: zodResolver(addExerciseSchema),
    defaultValues: {
      exerciseId: "",
      sets: 3,
      repsMin: undefined,
      repsMax: undefined,
      targetRpe: undefined,
      restSeconds: 90,
      notes: "",
    },
  });

  const selectedExerciseId = useWatch({
    control: form.control,
    name: "exerciseId",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      exerciseId: "",
      sets: 3,
      repsMin: undefined,
      repsMax: undefined,
      targetRpe: undefined,
      restSeconds: 90,
      notes: "",
    });
    setSearch("");
    setDebouncedSearch("");
  }, [form, open]);

  return (
    <AppDialogRoot open={open} onOpenChange={onOpenChange}>
      <AppDialogContent maxWidthClassName="max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-semibold text-card-foreground">
            {ru.common.actions.addExercise}
          </AppDialogTitle>
          <AppDialogDescription className="text-sm text-muted-foreground">
            {ru.workouts.addExerciseDescription}
          </AppDialogDescription>
        </AppDialogHeader>

        <form
          className="mt-4 space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit({
              exerciseId: values.exerciseId,
              sets: values.sets,
              repsMin: values.repsMin,
              repsMax: values.repsMax,
              targetRpe: values.targetRpe,
              restSeconds: values.restSeconds,
              notes: values.notes?.trim() || undefined,
            });
            onOpenChange(false);
          })}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {ru.common.placeholders.searchExercise}
            </label>
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={ru.common.placeholders.exerciseNameOrCode}
            />
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-sidebar/30 p-2">
              {exercisesQuery.isLoading ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">
                  {ru.workouts.loadingExercises}
                </p>
              ) : exercisesQuery.isError ? (
                <p className="px-2 py-3 text-sm text-destructive">{exercisesQuery.error.message}</p>
              ) : (exercisesQuery.data?.length ?? 0) === 0 ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">{ru.workouts.notFound}</p>
              ) : (
                <div className="space-y-1">
                  {exercisesQuery.data?.map((exercise) => {
                    const selected = selectedExerciseId === exercise.id;
                    const alreadyAdded = existingExerciseIds.includes(exercise.id);

                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        disabled={alreadyAdded}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          selected
                            ? "border-secondary/50 bg-secondary/15"
                            : "border-border bg-card hover:bg-secondary/10"
                        } ${alreadyAdded ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() =>
                          form.setValue("exerciseId", exercise.id, { shouldValidate: true })
                        }
                      >
                        <p className="font-medium text-foreground">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.code}
                          {exercise.createdByInfluencerId
                            ? ` · ${ru.workouts.unknownSourceInfluencer}`
                            : ` · ${ru.workouts.unknownSourceBase}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {form.formState.errors.exerciseId ? (
              <p className="text-xs text-destructive">{form.formState.errors.exerciseId.message}</p>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{ru.common.labels.sets}</label>
              <AppInput
                type="number"
                min={1}
                {...form.register("sets", {
                  setValueAs: (value) => (value === "" ? Number.NaN : Number(value)),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {ru.common.labels.repsMin}
              </label>
              <AppInput
                type="number"
                min={1}
                {...form.register("repsMin", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {ru.common.labels.repsMax}
              </label>
              <AppInput
                type="number"
                min={1}
                {...form.register("repsMax", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {ru.common.labels.targetRpe}
              </label>
              <AppInput
                type="number"
                min={1}
                max={10}
                step="0.5"
                {...form.register("targetRpe", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {ru.common.labels.restSeconds}
              </label>
              <AppInput
                type="number"
                min={0}
                {...form.register("restSeconds", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{ru.common.labels.notes}</label>
            <AppTextarea {...form.register("notes")} className="min-h-20" />
          </div>

          <AppDialogFooter>
            <AppButton
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              {ru.common.actions.cancel}
            </AppButton>
            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? ru.workouts.adding : ru.common.actions.addExercise}
            </AppButton>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialogRoot>
  );
}
