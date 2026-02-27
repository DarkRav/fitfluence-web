import { cn } from "@/lib/utils";
import type { AdminProgressionPolicyStatus } from "@/api/adminProgression";
import { ru } from "@/localization/ru";

type ProgressionStatusBadgeProps = {
  status: AdminProgressionPolicyStatus;
};

function resolveStatusClassName(status: AdminProgressionPolicyStatus): string {
  if (status === "ACTIVE") {
    return "border-secondary/40 bg-secondary/10 text-secondary";
  }

  return "border-destructive/35 bg-destructive/10 text-destructive";
}

export function ProgressionStatusBadge({ status }: ProgressionStatusBadgeProps) {
  const label =
    status === "ACTIVE" ? ru.progression.filters.active : ru.progression.filters.archived;

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-1 text-xs font-semibold tracking-wide",
        resolveStatusClassName(status),
      )}
    >
      {label}
    </span>
  );
}
