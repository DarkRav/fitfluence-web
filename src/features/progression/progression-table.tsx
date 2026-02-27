"use client";

import { AppButton } from "@/shared/ui";
import type { ProgressionRecord } from "@/features/progression/types";
import { ProgressionStatusBadge } from "@/features/progression/status-badge";
import { ru } from "@/localization/ru";

type ProgressionTableProps = {
  items: ProgressionRecord[];
  showOwnerColumns: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onOpen: (item: ProgressionRecord) => void;
  onDelete: (item: ProgressionRecord) => void;
};

function formatOwner(item: ProgressionRecord): string {
  const ownerTypeLabel =
    item.ownerType === "ADMIN" ? ru.progression.filters.admin : ru.progression.filters.influencer;

  if (!item.ownerId) {
    return ownerTypeLabel;
  }

  return `${ownerTypeLabel} · ${item.ownerId}`;
}

function formatType(type: ProgressionRecord["type"]): string {
  if (type === "DOUBLE_PROGRESSION") {
    return ru.progression.types.DOUBLE_PROGRESSION;
  }

  if (type === "LINEAR_LOAD") {
    return ru.progression.types.LINEAR_LOAD;
  }

  return ru.progression.types.RPE_BASED;
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
            <th className="px-4 py-3 font-medium">{ru.progression.table.code}</th>
            <th className="px-4 py-3 font-medium">{ru.progression.table.name}</th>
            <th className="px-4 py-3 font-medium">{ru.progression.table.type}</th>
            <th className="px-4 py-3 font-medium">{ru.progression.table.status}</th>
            {showOwnerColumns ? (
              <th className="px-4 py-3 font-medium">{ru.progression.table.owner}</th>
            ) : null}
            <th className="px-4 py-3 font-medium">{ru.progression.table.updated}</th>
            <th className="px-4 py-3 text-right font-medium">{ru.progression.table.actions}</th>
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
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatType(item.type)}</td>
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
                    {canEdit
                      ? `${ru.common.actions.open} / ${ru.common.actions.edit}`
                      : ru.common.actions.open}
                  </AppButton>
                  {canDelete ? (
                    <AppButton
                      type="button"
                      variant="destructive"
                      className="h-9 px-3 text-xs"
                      onClick={() => onDelete(item)}
                    >
                      {ru.common.actions.archive}
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
