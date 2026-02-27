"use client";

import { AppButton } from "@/shared/ui";
import { StatusBadge } from "@/features/programs/status-badge";
import type { ProgramVersionRecord } from "@/features/programs/types";

type ProgramVersionsTableProps = {
  items: ProgramVersionRecord[];
};

export function ProgramVersionsTable({ items }: ProgramVersionsTableProps) {
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
                <div className="flex justify-end">
                  <AppButton
                    type="button"
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    disabled
                  >
                    Workouts (Next step)
                  </AppButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
