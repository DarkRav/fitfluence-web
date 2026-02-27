import { AppButton } from "@/shared/ui";
import { StatusBadge } from "@/features/programs/status-badge";
import type { ProgramRecord } from "@/features/programs/types";
import { ru } from "@/localization/ru";

type ProgramHeaderProps = {
  program: ProgramRecord;
  onBack: () => void;
};

export function ProgramHeader({ program, onBack }: ProgramHeaderProps) {
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

        <AppButton type="button" variant="secondary" onClick={onBack}>
          {ru.common.actions.toList}
        </AppButton>
      </div>
    </div>
  );
}
