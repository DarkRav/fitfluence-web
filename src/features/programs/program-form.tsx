"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AdminProgramStatus } from "@/api/adminPrograms";
import { searchInfluencerOptions } from "@/api/influencers";
import { type ProgramCreatePayload, type ProgramUpdatePayload } from "@/features/programs/types";
import { MediaPicker } from "@/features/media";
import { ru } from "@/localization/ru";
import { AppButton, AppInput, AppSelect } from "@/shared/ui";

const statusOptions = [
  { value: "DRAFT", label: ru.common.status.DRAFT },
  { value: "PUBLISHED", label: ru.common.status.PUBLISHED },
  { value: "ARCHIVED", label: ru.common.status.ARCHIVED },
] as const;

const programFormSchema = z.object({
  influencerId: z.string().trim().optional(),
  title: z.string().trim().min(1, ru.programs.form.titleRequired),
  description: z.string().trim().optional(),
  goalsInput: z.string().trim().optional(),
  coverMediaId: z.union([z.literal(""), z.string().uuid(ru.programs.form.invalidMediaId)]),
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
  const [influencerSearch, setInfluencerSearch] = useState("");
  const [debouncedInfluencerSearch, setDebouncedInfluencerSearch] = useState("");

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: buildDefaultValues(initialValues),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(initialValues));
  }, [form, initialValues]);

  useEffect(() => {
    if (!requireInfluencerId || mode !== "create") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedInfluencerSearch(influencerSearch);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [influencerSearch, mode, requireInfluencerId]);

  const influencerOptionsQuery = useQuery({
    queryKey: ["influencerOptions", debouncedInfluencerSearch],
    enabled: requireInfluencerId && mode === "create",
    queryFn: async () => {
      const result = await searchInfluencerOptions({ search: debouncedInfluencerSearch });
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const influencerId = values.influencerId?.trim();
        if (mode === "create" && requireInfluencerId && !influencerId) {
          form.setError("influencerId", {
            message: ru.programs.form.influencerRequired,
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
          <label className="text-sm font-medium text-foreground">
            {ru.common.labels.influencer}
          </label>
          <AppInput
            value={influencerSearch}
            onChange={(event) => setInfluencerSearch(event.target.value)}
            placeholder={ru.common.placeholders.searchInfluencer}
            disabled={isSubmitting}
          />
          <Controller
            control={form.control}
            name="influencerId"
            render={({ field }) => (
              <AppSelect
                value={field.value}
                onValueChange={field.onChange}
                options={(influencerOptionsQuery.data ?? []).map((item) => ({
                  value: item.id,
                  label: item.displayName,
                }))}
                placeholder={
                  influencerOptionsQuery.isLoading
                    ? ru.common.placeholders.loadingInfluencers
                    : ru.common.placeholders.selectInfluencer
                }
              />
            )}
          />
          {form.formState.errors.influencerId ? (
            <p className="text-xs text-destructive">{form.formState.errors.influencerId.message}</p>
          ) : null}
          {!influencerOptionsQuery.isLoading && (influencerOptionsQuery.data?.length ?? 0) === 0 ? (
            <p className="text-xs text-muted-foreground">{ru.programs.form.noInfluencers}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{ru.common.labels.title}</label>
        <AppInput
          {...form.register("title")}
          placeholder={ru.common.placeholders.titleExampleProgram}
          disabled={isSubmitting}
        />
        {form.formState.errors.title ? (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {ru.common.labels.description}
        </label>
        <textarea
          {...form.register("description")}
          placeholder={ru.common.placeholders.descriptionProgram}
          disabled={isSubmitting}
          className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {ru.common.labels.goals} ({ru.programs.form.goalsHint})
        </label>
        <AppInput
          {...form.register("goalsInput")}
          placeholder={ru.common.placeholders.goalsComma}
          disabled={isSubmitting}
        />
      </div>

      {mode === "edit" ? (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{ru.common.labels.status}</label>
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
                placeholder={ru.programs.form.statusSelect}
              />
            )}
          />
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{ru.common.labels.coverMedia}</label>
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
                  {ru.common.actions.clearCover}
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
            {ru.common.actions.cancel}
          </AppButton>
        ) : null}
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? ru.programs.form.saving : submitLabel}
        </AppButton>
      </div>
    </form>
  );
}
