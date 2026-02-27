"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import {
  type AddWorkoutExercisePayload,
  type WorkoutExerciseRecord,
  type WorkoutsScopeConfig,
} from "@/features/workouts/types";
import { AppButton, AppInput } from "@/shared/ui";

const addExerciseSchema = z.object({
  exerciseId: z.string().uuid("Выберите упражнение"),
  sets: z.number().int().min(1, "Минимум 1 подход"),
  repsMin: z.number().int().min(1).optional(),
  repsMax: z.number().int().min(1).optional(),
  targetRpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type AddExerciseValues = z.infer<typeof addExerciseSchema>;

type AddExerciseDialogProps = {
  scope: WorkoutsScopeConfig;
  open: boolean;
  isSubmitting: boolean;
  existingExerciseIds: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AddWorkoutExercisePayload) => Promise<WorkoutExerciseRecord>;
};

export function AddExerciseDialog({
  scope,
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
    queryKey: [...scope.queryKeys.addExercise, debouncedSearch],
    enabled: open,
    queryFn: async () => {
      const result = await scope.api.searchExercises({
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Add exercise
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Найдите упражнение и задайте стартовые параметры.
          </Dialog.Description>

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
              <label className="text-sm font-medium text-foreground">Search exercise</label>
              <AppInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or code"
              />
              <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-sidebar/30 p-2">
                {exercisesQuery.isLoading ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">Загружаем упражнения...</p>
                ) : exercisesQuery.isError ? (
                  <p className="px-2 py-3 text-sm text-destructive">
                    {exercisesQuery.error.message}
                  </p>
                ) : (exercisesQuery.data?.length ?? 0) === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">Ничего не найдено.</p>
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
                              ? scope.scope === "influencer"
                                ? " · My"
                                : " · Influencer"
                              : " · Base"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {form.formState.errors.exerciseId ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.exerciseId.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Sets</label>
                <AppInput
                  type="number"
                  min={1}
                  {...form.register("sets", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Reps min</label>
                <AppInput
                  type="number"
                  min={1}
                  {...form.register("repsMin", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Reps max</label>
                <AppInput
                  type="number"
                  min={1}
                  {...form.register("repsMax", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Target RPE</label>
                <AppInput
                  type="number"
                  min={1}
                  max={10}
                  step="0.5"
                  {...form.register("targetRpe", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Rest seconds</label>
                <AppInput
                  type="number"
                  min={0}
                  {...form.register("restSeconds", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                {...form.register("notes")}
                className="min-h-20 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
              />
            </div>

            <div className="flex justify-end gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </AppButton>
              <AppButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add exercise"}
              </AppButton>
            </div>
          </form>

          <Dialog.Close
            disabled={isSubmitting}
            className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition hover:bg-card disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
