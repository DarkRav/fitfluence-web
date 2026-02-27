"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AppButton } from "@/shared/ui";
import type { ProgramVersionRecord } from "@/features/programs/types";
import { ru } from "@/localization/ru";

type PublishVersionDialogProps = {
  open: boolean;
  version: ProgramVersionRecord | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

export function PublishVersionDialog({
  open,
  version,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: PublishVersionDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            {ru.common.actions.publish}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            {ru.programs.publishDialogDescription}
          </Dialog.Description>

          {version ? (
            <p className="mt-3 text-sm text-foreground">
              Version: <span className="font-semibold">v{version.versionNumber}</span>
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2">
            <AppButton
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              {ru.common.actions.cancel}
            </AppButton>
            <AppButton
              type="button"
              disabled={isSubmitting || !version}
              onClick={async () => {
                await onConfirm();
              }}
            >
              {isSubmitting ? ru.programs.publishing : ru.common.actions.publish}
            </AppButton>
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
