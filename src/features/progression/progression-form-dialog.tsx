"use client";

import { useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import type {
  AdminProgressionPolicyOwnerType,
  AdminProgressionPolicyStatus,
  AdminProgressionPolicyType,
  CreateAdminProgressionPolicyPayload,
  UpdateAdminProgressionPolicyPayload,
} from "@/api/adminProgression";
import type { ProgressionRecord } from "@/features/progression/types";
import { ru } from "@/localization/ru";
import { AppButton, AppInput, AppSelect } from "@/shared/ui";

const typeOptions: { value: AdminProgressionPolicyType; label: string }[] = [
  { value: "DOUBLE_PROGRESSION", label: ru.progression.types.DOUBLE_PROGRESSION },
  { value: "LINEAR_LOAD", label: ru.progression.types.LINEAR_LOAD },
  { value: "RPE_BASED", label: ru.progression.types.RPE_BASED },
];

const statusOptions: { value: AdminProgressionPolicyStatus; label: string }[] = [
  { value: "ACTIVE", label: ru.progression.filters.active },
  { value: "ARCHIVED", label: ru.progression.filters.archived },
];

const ownerTypeOptions: { value: AdminProgressionPolicyOwnerType; label: string }[] = [
  { value: "ADMIN", label: ru.progression.filters.admin },
  { value: "INFLUENCER", label: ru.progression.filters.influencer },
];

const formSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, ru.progression.form.codeRequired)
      .max(120, ru.progression.form.max120),
    name: z
      .string()
      .trim()
      .min(1, ru.progression.form.nameRequired)
      .max(200, ru.progression.form.max200),
    description: z.string().trim().max(2000, ru.progression.form.max2000).optional(),
    type: z.enum(["DOUBLE_PROGRESSION", "LINEAR_LOAD", "RPE_BASED"]),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
    ownerType: z.enum(["ADMIN", "INFLUENCER"]).optional(),
    ownerId: z.string().trim().optional(),
  })
  .refine(
    (value) => {
      if (value.ownerType === "INFLUENCER") {
        return Boolean(value.ownerId?.trim());
      }

      return true;
    },
    {
      message: ru.progression.form.ownerIdRequiredForInfluencer,
      path: ["ownerId"],
    },
  );

type ProgressionFormValues = z.infer<typeof formSchema>;

type ProgressionFormDialogProps = {
  open: boolean;
  mode: "create" | "edit" | "view";
  item?: ProgressionRecord;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitCreate: (payload: CreateAdminProgressionPolicyPayload) => Promise<void>;
  onSubmitUpdate: (id: string, payload: UpdateAdminProgressionPolicyPayload) => Promise<void>;
};

function buildDefaults(
  item: ProgressionRecord | undefined,
  mode: ProgressionFormDialogProps["mode"],
): ProgressionFormValues {
  if (!item) {
    return {
      code: "",
      name: "",
      description: "",
      type: "DOUBLE_PROGRESSION",
      status: "ACTIVE",
      ownerType: "ADMIN",
      ownerId: "",
    };
  }

  return {
    code: item.code,
    name: item.name,
    description: item.description ?? "",
    type: item.type,
    status: item.status,
    ownerType: mode === "create" ? item.ownerType : undefined,
    ownerId: mode === "create" ? (item.ownerId ?? "") : "",
  };
}

export function ProgressionFormDialog({
  open,
  mode,
  item,
  isSubmitting,
  onOpenChange,
  onSubmitCreate,
  onSubmitUpdate,
}: ProgressionFormDialogProps) {
  const isReadOnly = mode === "view";
  const form = useForm<ProgressionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaults(item, mode),
  });

  useEffect(() => {
    form.reset(buildDefaults(item, mode));
  }, [form, item, mode]);

  const title = useMemo(() => {
    if (mode === "create") {
      return ru.progression.form.createTitle;
    }

    if (mode === "edit") {
      return ru.progression.form.editTitle;
    }

    return ru.progression.form.viewTitle;
  }, [mode]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            {ru.progression.form.description}
          </Dialog.Description>

          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              if (isReadOnly) {
                return;
              }

              if (mode === "create") {
                await onSubmitCreate({
                  code: values.code.trim(),
                  name: values.name.trim(),
                  description: values.description?.trim() || undefined,
                  type: values.type,
                  status: values.status,
                  ownerType: values.ownerType,
                  ownerId: values.ownerId?.trim() || undefined,
                });
                return;
              }

              if (!item) {
                return;
              }

              await onSubmitUpdate(item.id, {
                code: values.code.trim(),
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
                type: values.type,
                status: values.status,
              });
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.progression.form.codeLabel}
                </label>
                <AppInput {...form.register("code")} disabled={isReadOnly || isSubmitting} />
                {form.formState.errors.code ? (
                  <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.progression.form.nameLabel}
                </label>
                <AppInput {...form.register("name")} disabled={isReadOnly || isSubmitting} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {ru.progression.form.descriptionLabel}
              </label>
              <textarea
                {...form.register("description")}
                disabled={isReadOnly || isSubmitting}
                className="min-h-20 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.progression.form.typeLabel}
                </label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <AppSelect
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as AdminProgressionPolicyType)}
                      options={typeOptions}
                      placeholder={ru.progression.form.typePlaceholder}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {ru.progression.form.statusLabel}
                </label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <AppSelect
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as AdminProgressionPolicyStatus)
                      }
                      options={statusOptions}
                      placeholder={ru.progression.form.statusPlaceholder}
                    />
                  )}
                />
              </div>
            </div>

            {mode === "create" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {ru.progression.form.ownerTypeLabel}
                  </label>
                  <Controller
                    control={form.control}
                    name="ownerType"
                    render={({ field }) => (
                      <AppSelect
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as AdminProgressionPolicyOwnerType)
                        }
                        options={ownerTypeOptions}
                        placeholder={ru.progression.form.ownerTypePlaceholder}
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {ru.progression.form.ownerIdLabel}
                  </label>
                  <AppInput
                    {...form.register("ownerId")}
                    placeholder={ru.progression.form.ownerIdPlaceholder}
                    disabled={isReadOnly || isSubmitting}
                  />
                  {form.formState.errors.ownerId ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.ownerId.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                {isReadOnly ? ru.common.actions.close : ru.common.actions.cancel}
              </AppButton>
              {!isReadOnly ? (
                <AppButton type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? `${ru.common.actions.save}...`
                    : mode === "create"
                      ? ru.common.actions.create
                      : ru.common.actions.save}
                </AppButton>
              ) : null}
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
