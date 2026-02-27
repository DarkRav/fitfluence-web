"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { AppButton, AppInput, AppSelect } from "@/shared/ui";
import type { ReferenceFormField } from "@/features/reference/reference-types";
import type { z } from "zod";

type ReferenceFormDialogProps<TValues extends Record<string, string>> = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  submitLabel: string;
  schema: z.ZodTypeAny;
  fields: ReferenceFormField<TValues>[];
  defaultValues: TValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TValues) => Promise<void>;
  isSubmitting: boolean;
};

export function ReferenceFormDialog<TValues extends Record<string, string>>({
  open,
  mode,
  title,
  submitLabel,
  schema,
  fields,
  defaultValues,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ReferenceFormDialogProps<TValues>) {
  const resolver = (zodResolver as unknown as (value: unknown) => unknown)(schema);

  const form = useForm<TValues>({
    resolver: resolver as never,
    defaultValues: defaultValues as never,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Заполните поля формы и нажмите «Сохранить».
          </Dialog.Description>

          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
            })}
          >
            {fields.map((field) => {
              const isDisabled = isSubmitting || (mode === "edit" && field.disabledInEdit);
              const errorMessage = form.formState.errors[field.name]?.message;

              if (field.type === "select") {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    <Controller
                      control={form.control}
                      name={field.name as never}
                      render={({ field: controlledField }) => (
                        <AppSelect
                          value={controlledField.value}
                          onValueChange={controlledField.onChange}
                          options={field.options}
                          placeholder={field.placeholder}
                        />
                      )}
                    />
                    {errorMessage ? (
                      <p className="text-xs text-destructive">{String(errorMessage)}</p>
                    ) : null}
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    <textarea
                      {...form.register(field.name as never)}
                      placeholder={field.placeholder}
                      disabled={isDisabled}
                      className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
                    />
                    {errorMessage ? (
                      <p className="text-xs text-destructive">{String(errorMessage)}</p>
                    ) : null}
                  </div>
                );
              }

              return (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  <AppInput
                    {...form.register(field.name as never)}
                    placeholder={field.placeholder}
                    disabled={isDisabled}
                  />
                  {errorMessage ? (
                    <p className="text-xs text-destructive">{String(errorMessage)}</p>
                  ) : null}
                </div>
              );
            })}

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
                {isSubmitting ? "Сохраняем..." : submitLabel}
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
