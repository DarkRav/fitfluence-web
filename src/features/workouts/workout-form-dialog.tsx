"use client";

import { useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import type {
  CreateWorkoutPayload,
  UpdateWorkoutPayload,
  WorkoutTemplateRecord,
} from "@/features/workouts/types";
import { AppButton, AppInput } from "@/shared/ui";

const workoutFormSchema = z.object({
  dayOrder: z.number().int().min(1, "Day order должен быть больше 0"),
  title: z.string().trim().max(200, "Максимум 200 символов").optional(),
  coachNote: z.string().trim().max(2000, "Максимум 2000 символов").optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

type WorkoutFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  workout?: WorkoutTemplateRecord;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (payload: CreateWorkoutPayload) => Promise<void>;
  onUpdate?: (workoutTemplateId: string, payload: UpdateWorkoutPayload) => Promise<void>;
};

function buildDefaultValues(workout?: WorkoutTemplateRecord): WorkoutFormValues {
  return {
    dayOrder: workout?.dayOrder ?? 1,
    title: workout?.title ?? "",
    coachNote: workout?.coachNote ?? "",
  };
}

export function WorkoutFormDialog({
  open,
  mode,
  workout,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: WorkoutFormDialogProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: buildDefaultValues(workout),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(workout));
  }, [form, workout]);

  const title = useMemo(() => {
    if (mode === "create") {
      return "Create workout";
    }

    return "Edit workout";
  }, [mode]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Заполните базовые параметры workout template.
          </Dialog.Description>

          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              if (mode === "create") {
                if (!onCreate) {
                  return;
                }
                await onCreate({
                  dayOrder: values.dayOrder,
                  title: values.title?.trim() || undefined,
                  coachNote: values.coachNote?.trim() || undefined,
                });
                return;
              }

              if (!workout) {
                return;
              }
              if (!onUpdate) {
                return;
              }

              await onUpdate(workout.id, {
                dayOrder: values.dayOrder,
                title: values.title?.trim() || undefined,
                coachNote: values.coachNote?.trim() || undefined,
              });
            })}
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Day order</label>
              <AppInput
                type="number"
                min={1}
                {...form.register("dayOrder", { valueAsNumber: true })}
              />
              {form.formState.errors.dayOrder ? (
                <p className="text-xs text-destructive">{form.formState.errors.dayOrder.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Title</label>
              <AppInput placeholder="Upper Body A" {...form.register("title")} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Coach note</label>
              <textarea
                {...form.register("coachNote")}
                className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
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
                {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
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
