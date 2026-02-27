"use client";

import { AppButton } from "@/shared/ui";
import { StatusBadge } from "@/features/programs/status-badge";
import type { ProgramVersionRecord } from "@/features/programs/types";
import { ru } from "@/localization/ru";

type VersionsTableProps = {
  items: ProgramVersionRecord[];
  canPublish: boolean;
  isPublishing: boolean;
  onPublish?: (item: ProgramVersionRecord) => void;
  onOpenWorkouts?: (item: ProgramVersionRecord) => void;
};

export function VersionsTable({
  items,
  canPublish,
  isPublishing,
  onPublish,
  onOpenWorkouts,
}: VersionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">{ru.common.labels.version}</th>
            <th className="px-4 py-3 font-medium">{ru.common.labels.level}</th>
            <th className="px-4 py-3 font-medium">{ru.common.labels.frequency}</th>
            <th className="px-4 py-3 font-medium">{ru.common.labels.status}</th>
            <th className="px-4 py-3 font-medium">{ru.common.labels.published}</th>
            <th className="px-4 py-3 font-medium">{ru.common.labels.updatedAt}</th>
            <th className="px-4 py-3 text-right font-medium">{ru.common.labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
            >
              <td className="px-4 py-3 font-medium">v{item.versionNumber}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {item.level ?? ru.common.states.dash}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {item.frequencyPerWeek ?? ru.common.states.dash}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.publishedAt
                  ? new Date(item.publishedAt).toLocaleString()
                  : ru.common.states.dash}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ru.common.states.dash}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {onOpenWorkouts ? (
                    <AppButton
                      type="button"
                      variant="secondary"
                      className="h-9 px-3 text-xs"
                      onClick={() => onOpenWorkouts(item)}
                    >
                      {ru.common.labels.workouts}
                    </AppButton>
                  ) : null}
                  {canPublish && item.status === "DRAFT" ? (
                    <AppButton
                      type="button"
                      className="h-9 px-3 text-xs"
                      disabled={isPublishing}
                      onClick={() => onPublish?.(item)}
                    >
                      {ru.common.actions.publish}
                    </AppButton>
                  ) : (
                    <span className="text-xs text-muted-foreground">{ru.common.states.dash}</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
