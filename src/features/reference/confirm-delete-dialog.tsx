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

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <AppDialogRoot open={open} onOpenChange={onOpenChange}>
      <AppDialogContent maxWidthClassName="max-w-md">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-semibold text-card-foreground">
            {title}
          </AppDialogTitle>
          <AppDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogFooter>
          <AppButton
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </AppButton>
          <AppButton
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? "Удаляем..." : "Удалить"}
          </AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialogRoot>
  );
}
