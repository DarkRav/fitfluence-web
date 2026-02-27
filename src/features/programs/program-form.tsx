"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AdminProgramStatus } from "@/api/adminPrograms";
import { type ProgramCreatePayload, type ProgramUpdatePayload } from "@/features/programs/types";
import { MediaPicker } from "@/features/media";
import { AppButton, AppInput, AppSelect } from "@/shared/ui";

const statusOptions = [
  { value: "DRAFT", label: "Черновик" },
  { value: "PUBLISHED", label: "Опубликована" },
  { value: "ARCHIVED", label: "Архив" },
] as const;

const programFormSchema = z.object({
  influencerId: z.string().trim().optional(),
  title: z.string().trim().min(1, "Укажите название программы"),
  description: z.string().trim().optional(),
  goalsInput: z.string().trim().optional(),
  coverMediaId: z.union([z.literal(""), z.string().uuid("Некорректный ID медиа")]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export type ProgramFormInitialValues = {
  influencerId?: string;
  title: string;
  description: string;
  goals: string[];
  coverMediaId: string;
  status?: AdminProgramStatus;
};

type ProgramFormProps = {
  initialValues: ProgramFormInitialValues;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
  requireInfluencerId?: boolean;
} & (
  | {
      mode: "create";
      onSubmit: (payload: ProgramCreatePayload) => Promise<void>;
    }
  | {
      mode: "edit";
      onSubmit: (payload: ProgramUpdatePayload) => Promise<void>;
    }
);

function buildDefaultValues(initialValues: ProgramFormInitialValues): ProgramFormValues {
  return {
    influencerId: initialValues.influencerId ?? "",
    title: initialValues.title,
    description: initialValues.description,
    goalsInput: initialValues.goals.join(", "),
    coverMediaId: initialValues.coverMediaId,
    status: initialValues.status,
  };
}

function parseGoals(goalsInput?: string): string[] | undefined {
  if (!goalsInput) {
    return undefined;
  }

  const goals = goalsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return goals.length > 0 ? goals : undefined;
}

export function ProgramForm({
  mode,
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
  requireInfluencerId = false,
}: ProgramFormProps) {
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: buildDefaultValues(initialValues),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(initialValues));
  }, [form, initialValues]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const influencerId = values.influencerId?.trim();
        if (mode === "create" && requireInfluencerId && !influencerId) {
          form.setError("influencerId", {
            message: "Укажите influencerId",
          });
          return;
        }

        const basePayload = {
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          goals: parseGoals(values.goalsInput),
          coverMediaId: values.coverMediaId || undefined,
        };

        if (mode === "edit") {
          await onSubmit({
            ...basePayload,
            status: values.status,
          });
          return;
        }

        await onSubmit({
          ...basePayload,
          ...(requireInfluencerId ? { influencerId } : {}),
        });
      })}
    >
      {mode === "create" && requireInfluencerId ? (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Influencer ID</label>
          <AppInput
            {...form.register("influencerId")}
            placeholder="UUID инфлюэнсера"
            disabled={isSubmitting}
          />
          {form.formState.errors.influencerId ? (
            <p className="text-xs text-destructive">{form.formState.errors.influencerId.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Название</label>
        <AppInput
          {...form.register("title")}
          placeholder="Например: Summer Shred"
          disabled={isSubmitting}
        />
        {form.formState.errors.title ? (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Описание</label>
        <textarea
          {...form.register("description")}
          placeholder="Кратко опишите идею программы"
          disabled={isSubmitting}
          className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Goals (через запятую)</label>
        <AppInput
          {...form.register("goalsInput")}
          placeholder="fat loss, mobility, endurance"
          disabled={isSubmitting}
        />
      </div>

      {mode === "edit" ? (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Статус</label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <AppSelect
                value={field.value}
                onValueChange={(value) => field.onChange(value as AdminProgramStatus)}
                options={statusOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                placeholder="Выберите статус"
              />
            )}
          />
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Cover Media</label>
        <Controller
          control={form.control}
          name="coverMediaId"
          render={({ field }) => (
            <div className="space-y-2">
              <MediaPicker value={field.value || undefined} onChange={field.onChange} />
              {field.value ? (
                <AppButton
                  type="button"
                  variant="secondary"
                  className="h-9 px-3 text-xs"
                  onClick={() => field.onChange("")}
                  disabled={isSubmitting}
                >
                  Очистить cover
                </AppButton>
              ) : null}
            </div>
          )}
        />
        {form.formState.errors.coverMediaId ? (
          <p className="text-xs text-destructive">{form.formState.errors.coverMediaId.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <AppButton type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
            Отмена
          </AppButton>
        ) : null}
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохраняем..." : submitLabel}
        </AppButton>
      </div>
    </form>
  );
}
