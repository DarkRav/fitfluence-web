"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
import {
  exerciseDifficultyOptions,
  exerciseMovementPatternOptions,
  type ExerciseDifficultyLevel,
  type ExerciseMovementPattern,
} from "@/api/adminExercises";
import type { ReferenceOption } from "@/api/referenceData";
import { ExerciseMediaSection } from "@/features/exercises/exercise-media-section";
import { MultiSelectEquipment } from "@/features/exercises/multi-select-equipment";
import { MultiSelectMuscles } from "@/features/exercises/multi-select-muscles";
import type {
  CreateExerciseCrudPayload,
  ExerciseCrudItem,
  ExerciseCrudScope,
  UpdateExerciseCrudPayload,
} from "@/features/exercises/types";
import { AppButton, AppInput, AppSelect } from "@/shared/ui";

const NONE_SELECT_VALUE = "__none__";

const createSchema = z.object({
  code: z.string().trim().min(2, "Укажите код упражнения"),
  name: z.string().trim().min(2, "Укажите название упражнения"),
  description: z.string().trim().optional(),
  movementPattern: z
    .union([z.literal(NONE_SELECT_VALUE), z.enum(["PUSH", "PULL", "SQUAT", "HINGE", "OTHER"])])
    .optional(),
  difficultyLevel: z
    .union([z.literal(NONE_SELECT_VALUE), z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])])
    .optional(),
  isBodyweight: z.boolean(),
  muscleIds: z.array(z.string().uuid()).min(1, "Выберите хотя бы одну мышцу"),
  equipmentIds: z.array(z.string().uuid()),
  mediaIds: z.array(z.string().uuid()),
});

type ExerciseFormValues = z.infer<typeof createSchema>;

type ExerciseFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  scope: ExerciseCrudScope;
  item?: ExerciseCrudItem;
  muscleOptions: ReferenceOption[];
  equipmentOptions: ReferenceOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateExerciseCrudPayload | UpdateExerciseCrudPayload) => Promise<void>;
};

function buildDefaultValues(item?: ExerciseCrudItem): ExerciseFormValues {
  return {
    code: item?.code ?? "",
    name: item?.name ?? "",
    description: item?.description ?? "",
    movementPattern: item?.movementPattern ?? NONE_SELECT_VALUE,
    difficultyLevel: item?.difficultyLevel ?? NONE_SELECT_VALUE,
    isBodyweight: item?.isBodyweight ?? false,
    muscleIds: item?.muscleIds ?? [],
    equipmentIds: item?.equipmentIds ?? [],
    mediaIds: item?.mediaIds ?? [],
  };
}

function toOptionalMovementPattern(value?: string): ExerciseMovementPattern | undefined {
  if (!value || value === NONE_SELECT_VALUE) {
    return undefined;
  }

  return value as ExerciseMovementPattern;
}

function toOptionalDifficultyLevel(value?: string): ExerciseDifficultyLevel | undefined {
  if (!value || value === NONE_SELECT_VALUE) {
    return undefined;
  }

  return value as ExerciseDifficultyLevel;
}

export function ExerciseFormDialog({
  open,
  mode,
  scope,
  item,
  muscleOptions,
  equipmentOptions,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ExerciseFormDialogProps) {
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: buildDefaultValues(item),
  });

  useEffect(() => {
    if (open) {
      form.reset(buildDefaultValues(item));
    }
  }, [form, item, open]);

  const movementOptions = [
    { value: NONE_SELECT_VALUE, label: "Не выбрано" },
    ...exerciseMovementPatternOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const difficultyOptions = [
    { value: NONE_SELECT_VALUE, label: "Не выбрано" },
    ...exerciseDifficultyOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {mode === "create" ? "Новое упражнение" : "Редактировать упражнение"}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Заполните базовые поля упражнения и сохраните изменения.
          </Dialog.Description>

          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              const payload = {
                ...(mode === "create" ? { code: values.code.trim() } : {}),
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
                movementPattern: toOptionalMovementPattern(values.movementPattern),
                difficultyLevel: toOptionalDifficultyLevel(values.difficultyLevel),
                isBodyweight: values.isBodyweight,
                muscleIds: values.muscleIds,
                equipmentIds: values.equipmentIds,
                mediaIds: values.mediaIds,
              };

              await onSubmit(payload);
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Код</label>
                <AppInput
                  {...form.register("code")}
                  placeholder="BARBELL_BENCH_PRESS"
                  disabled={mode === "edit" || isSubmitting}
                />
                {form.formState.errors.code ? (
                  <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Название</label>
                <AppInput
                  {...form.register("name")}
                  placeholder="Жим штанги лёжа"
                  disabled={isSubmitting}
                />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Описание</label>
              <textarea
                {...form.register("description")}
                placeholder="Краткая подсказка по технике"
                disabled={isSubmitting}
                className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Двигательный паттерн</label>
                <Controller
                  control={form.control}
                  name="movementPattern"
                  render={({ field }) => (
                    <AppSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={movementOptions}
                      placeholder="Выберите паттерн"
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Уровень сложности</label>
                <Controller
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <AppSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={difficultyOptions}
                      placeholder="Выберите уровень"
                    />
                  )}
                />
              </div>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-md border border-border/80 bg-sidebar/40 px-3 py-2 text-sm text-foreground">
              <input
                type="checkbox"
                {...form.register("isBodyweight")}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-border bg-card text-secondary"
              />
              Упражнение с весом собственного тела
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="muscleIds"
                render={({ field }) => (
                  <MultiSelectMuscles
                    value={field.value}
                    options={muscleOptions}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="equipmentIds"
                render={({ field }) => (
                  <MultiSelectEquipment
                    value={field.value}
                    options={equipmentOptions}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {form.formState.errors.muscleIds ? (
              <p className="text-xs text-destructive">{form.formState.errors.muscleIds.message}</p>
            ) : null}

            <Controller
              control={form.control}
              name="mediaIds"
              render={({ field }) => (
                <ExerciseMediaSection
                  scope={scope}
                  mediaIds={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </AppButton>
              <AppButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохраняем..." : "Сохранить"}
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
