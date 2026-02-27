import { AppButton } from "@/shared/ui";
import type { InfluencerProgramRecord } from "@/api/influencerPrograms";

function mapProgramStatusLabel(status: InfluencerProgramRecord["status"]): string {
  if (status === "DRAFT") {
    return "Черновик";
  }

  if (status === "PUBLISHED") {
    return "Опубликована";
  }

  if (status === "ARCHIVED") {
    return "Архив";
  }

  return status;
}

type ProgramHeaderProps = {
  program: InfluencerProgramRecord;
  onBack: () => void;
};

export function ProgramHeader({ program, onBack }: ProgramHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{program.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-secondary/35 bg-secondary/10 px-2 py-1 font-medium text-secondary">
              {mapProgramStatusLabel(program.status)}
            </span>
            <span>Program ID: {program.id}</span>
            {program.updatedAt ? (
              <span>Updated: {new Date(program.updatedAt).toLocaleString()}</span>
            ) : null}
          </div>
        </div>

        <AppButton type="button" variant="secondary" onClick={onBack}>
          К списку
        </AppButton>
      </div>
    </div>
  );
}
