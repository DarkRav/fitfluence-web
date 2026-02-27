import { AppButton } from "@/shared/ui";
import { StatusBadge } from "@/features/programs/status-badge";
import type { ProgramRecord } from "@/features/programs/types";
import { ru } from "@/localization/ru";
import type { ReactNode } from "react";

type ProgramHeaderProps = {
  program: ProgramRecord;
  onBack: () => void;
  controls?: ReactNode;
};

export function ProgramHeader({ program, onBack, controls }: ProgramHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{program.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <StatusBadge status={program.status} />
            <span>
              {ru.common.labels.programId}: {program.id}
            </span>
            {program.updatedAt ? (
              <span>
                {ru.common.labels.updated}: {new Date(program.updatedAt).toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {controls}
          <AppButton type="button" variant="secondary" onClick={onBack}>
            {ru.common.actions.toList}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
