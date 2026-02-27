import { cn } from "@/lib/utils";
import type { AdminProgramStatus } from "@/api/adminPrograms";
import type { AdminProgramVersionStatus } from "@/api/adminProgramVersions";

type StatusBadgeProps = {
  status: AdminProgramStatus | AdminProgramVersionStatus;
};

function mapStatusLabel(status: StatusBadgeProps["status"]): string {
  if (status === "DRAFT") {
    return "DRAFT";
  }

  if (status === "PUBLISHED") {
    return "PUBLISHED";
  }

  if (status === "ARCHIVED") {
    return "ARCHIVED";
  }

  return status;
}

function resolveStatusClassName(status: StatusBadgeProps["status"]): string {
  if (status === "PUBLISHED") {
    return "border-secondary/40 bg-secondary/10 text-secondary";
  }

  if (status === "ARCHIVED") {
    return "border-destructive/35 bg-destructive/10 text-destructive";
  }

  return "border-border bg-sidebar/70 text-muted-foreground";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-1 text-xs font-semibold tracking-wide",
        resolveStatusClassName(status),
      )}
    >
      {mapStatusLabel(status)}
    </span>
  );
}
