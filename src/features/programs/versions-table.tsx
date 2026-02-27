"use client";

import { AppButton } from "@/shared/ui";
import { StatusBadge } from "@/features/programs/status-badge";
import type { ProgramVersionRecord } from "@/features/programs/types";

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
            <th className="px-4 py-3 font-medium">Version</th>
            <th className="px-4 py-3 font-medium">Level</th>
            <th className="px-4 py-3 font-medium">Frequency</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Published</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
            >
              <td className="px-4 py-3 font-medium">v{item.versionNumber}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.level ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.frequencyPerWeek ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
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
                      Workouts
                    </AppButton>
                  ) : null}
                  {canPublish && item.status === "DRAFT" ? (
                    <AppButton
                      type="button"
                      className="h-9 px-3 text-xs"
                      disabled={isPublishing}
                      onClick={() => onPublish?.(item)}
                    >
                      Publish
                    </AppButton>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
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
