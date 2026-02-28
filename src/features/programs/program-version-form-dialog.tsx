"use client";

import { useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import type {
  CreateInfluencerProgramVersionPayload,
  InfluencerProgramVersionRecord,
  UpdateInfluencerProgramVersionPayload,
} from "@/api/influencerProgramVersions";
import { ru } from "@/localization/ru";
import { AppButton, AppInput } from "@/shared/ui";

const createSchema = z.object({
  versionNumber: z.number().int().min(1, ru.programs.form.versionNumberValidation),
  level: z.string().trim().max(120, ru.workouts.max200Validation).optional(),
  frequencyPerWeek: z.number().int().min(1).max(14).optional(),
});

const editSchema = z.object({
  level: z.string().trim().max(120, ru.workouts.max200Validation).optional(),
  frequencyPerWeek: z.number().int().min(1).max(14).optional(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

type ProgramVersionFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  version?: InfluencerProgramVersionRecord;
  suggestedVersionNumber?: number;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payload: CreateInfluencerProgramVersionPayload) => Promise<void>;
  onUpdate?: (versionId: string, payload: UpdateInfluencerProgramVersionPayload) => Promise<void>;
};

export function ProgramVersionFormDialog({
  open,
  mode,
  version,
  suggestedVersionNumber = 1,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: ProgramVersionFormDialogProps) {
  const title = useMemo(
    () => (mode === "create" ? ru.programs.versions.createVersion : ru.common.actions.edit),
    [mode],
  );

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      versionNumber: suggestedVersionNumber,
      level: "",
      frequencyPerWeek: undefined,
    },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      level: "",
      frequencyPerWeek: undefined,
    },
  });

  useEffect(() => {
    if (mode === "create") {
      createForm.reset({
        versionNumber: suggestedVersionNumber,
        level: "",
        frequencyPerWeek: undefined,
      });
      return;
    }

    editForm.reset({
      level: version?.level ?? "",
      frequencyPerWeek: version?.frequencyPerWeek,
    });
  }, [createForm, editForm, mode, suggestedVersionNumber, version]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            {ru.programs.versions.dialogDescription}
          </Dialog.Description>

          {mode === "create" ? (
            <form
              className="mt-4 space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                if (!onCreate) {
                  return;
                }

                await onCreate({
                  versionNumber: values.versionNumber,
                  level: values.level?.trim() || undefined,
                  frequencyPerWeek: values.frequencyPerWeek,
                });
              })}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.common.labels.versionNumber}
                </label>
                <AppInput
                  type="number"
                  min={1}
                  {...createForm.register("versionNumber", {
                    setValueAs: (value) => Number(value),
                  })}
                />
                {createForm.formState.errors.versionNumber ? (
                  <p className="text-xs text-destructive">
                    {createForm.formState.errors.versionNumber.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.common.labels.level}
                </label>
                <AppInput
                  {...createForm.register("level")}
                  placeholder={ru.common.placeholders.level}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.common.labels.frequencyPerWeek}
                </label>
                <AppInput
                  type="number"
                  min={1}
                  max={14}
                  {...createForm.register("frequencyPerWeek", {
                    setValueAs: (value) => {
                      if (value === "" || value === null || value === undefined) {
                        return undefined;
                      }
                      return Number(value);
                    },
                  })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <AppButton
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  {ru.common.actions.cancel}
                </AppButton>
                <AppButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? `${ru.common.actions.save}...` : ru.common.actions.create}
                </AppButton>
              </div>
            </form>
          ) : (
            <form
              className="mt-4 space-y-4"
              onSubmit={editForm.handleSubmit(async (values) => {
                if (!version) {
                  return;
                }
                if (!onUpdate) {
                  return;
                }

                await onUpdate(version.id, {
                  level: values.level?.trim() || undefined,
                  frequencyPerWeek: values.frequencyPerWeek,
                });
              })}
            >
              <div className="rounded-xl border border-border bg-sidebar/40 p-4 text-sm text-muted-foreground">
                {ru.common.labels.versionNumber}:{" "}
                <span className="font-semibold text-foreground">v{version?.versionNumber}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.common.labels.level}
                </label>
                <AppInput
                  {...editForm.register("level")}
                  placeholder={ru.common.placeholders.level}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.common.labels.frequencyPerWeek}
                </label>
                <AppInput
                  type="number"
                  min={1}
                  max={14}
                  {...editForm.register("frequencyPerWeek", {
                    setValueAs: (value) => {
                      if (value === "" || value === null || value === undefined) {
                        return undefined;
                      }
                      return Number(value);
                    },
                  })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <AppButton
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  {ru.common.actions.cancel}
                </AppButton>
                <AppButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? `${ru.common.actions.save}...` : ru.common.actions.save}
                </AppButton>
              </div>
            </form>
          )}

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
