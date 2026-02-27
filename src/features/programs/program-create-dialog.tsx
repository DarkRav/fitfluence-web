"use client";

import {
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogRoot,
  AppDialogTitle,
} from "@/components/ui";
import { ProgramForm } from "@/features/programs/program-form";
import type { ProgramCreatePayload } from "@/features/programs/types";
import { ru } from "@/localization/ru";

type ProgramCreateDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  requireInfluencerId?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ProgramCreatePayload) => Promise<void>;
};

export function ProgramCreateDialog({
  open,
  isSubmitting,
  requireInfluencerId = false,
  onOpenChange,
  onSubmit,
}: ProgramCreateDialogProps) {
  return (
    <AppDialogRoot open={open} onOpenChange={onOpenChange}>
      <AppDialogContent maxWidthClassName="max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-semibold text-card-foreground">
            {ru.programs.createProgram}
          </AppDialogTitle>
          <AppDialogDescription className="text-sm text-muted-foreground">
            Заполните метаданные программы. Версии и публикация будут доступны на следующем шаге.
          </AppDialogDescription>
        </AppDialogHeader>

        <div className="mt-4">
          <ProgramForm
            mode="create"
            initialValues={{
              influencerId: "",
              title: "",
              description: "",
              goals: [],
              coverMediaId: "",
              status: "DRAFT",
            }}
            requireInfluencerId={requireInfluencerId}
            isSubmitting={isSubmitting}
            submitLabel={ru.programs.createProgram}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </AppDialogContent>
    </AppDialogRoot>
  );
}
