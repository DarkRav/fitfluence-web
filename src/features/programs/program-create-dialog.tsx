"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ProgramForm } from "@/features/programs/program-form";
import type { ProgramCreatePayload } from "@/features/programs/types";

type ProgramCreateDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ProgramCreatePayload) => Promise<void>;
};

export function ProgramCreateDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ProgramCreateDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Создать программу
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Заполните метаданные программы. Версии и публикация будут доступны на следующем шаге.
          </Dialog.Description>

          <div className="mt-4">
            <ProgramForm
              mode="create"
              initialValues={{
                title: "",
                description: "",
                goals: [],
                coverMediaId: "",
                status: "DRAFT",
              }}
              isSubmitting={isSubmitting}
              submitLabel="Create Program"
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
            />
          </div>

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
