"use client";

import {
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogRoot,
  AppDialogTitle,
} from "@/components/ui";
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
    <AppDialogRoot open={open} onOpenChange={onOpenChange}>
      <AppDialogContent maxWidthClassName="max-w-md">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-semibold text-card-foreground">
            {ru.common.actions.publish}
          </AppDialogTitle>
          <AppDialogDescription className="text-sm text-muted-foreground">
            {ru.programs.publishDialogDescription}
          </AppDialogDescription>
        </AppDialogHeader>

        {version ? (
          <p className="mt-3 text-sm text-foreground">
            {ru.common.labels.version}:{" "}
            <span className="font-semibold">v{version.versionNumber}</span>
          </p>
        ) : null}

        <AppDialogFooter>
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
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialogRoot>
  );
}
