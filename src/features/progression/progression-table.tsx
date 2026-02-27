"use client";

import { AppButton } from "@/shared/ui";
import type { ProgressionRecord } from "@/features/progression/types";
import { ProgressionStatusBadge } from "@/features/progression/status-badge";

type ProgressionTableProps = {
  items: ProgressionRecord[];
  showOwnerColumns: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onOpen: (item: ProgressionRecord) => void;
  onDelete: (item: ProgressionRecord) => void;
};

function formatOwner(item: ProgressionRecord): string {
  if (!item.ownerId) {
    return item.ownerType;
  }

  return `${item.ownerType} · ${item.ownerId}`;
}

export function ProgressionTable({
  items,
  showOwnerColumns,
  canEdit,
  canDelete,
  onOpen,
  onDelete,
}: ProgressionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showOwnerColumns ? <th className="px-4 py-3 font-medium">Owner</th> : null}
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
              <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
              <td className="px-4 py-3">
                <p className="font-medium">{item.name}</p>
                {item.description ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{item.type}</td>
              <td className="px-4 py-3">
                <ProgressionStatusBadge status={item.status} />
              </td>
              {showOwnerColumns ? (
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatOwner(item)}</td>
              ) : null}
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <AppButton
                    type="button"
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={() => onOpen(item)}
                  >
                    {canEdit ? "Open/Edit" : "Open"}
                  </AppButton>
                  {canDelete ? (
                    <AppButton
                      type="button"
                      variant="destructive"
                      className="h-9 px-3 text-xs"
                      onClick={() => onDelete(item)}
                    >
                      Archive
                    </AppButton>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
