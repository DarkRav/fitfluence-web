"use client";

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

type ProgramsTableProps = {
  items: InfluencerProgramRecord[];
  onOpen: (item: InfluencerProgramRecord) => void;
};

export function ProgramsTable({ items, onOpen }: ProgramsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Обложка</th>
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Версия</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Обновлено</th>
            <th className="px-4 py-3 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
              onClick={() => onOpen(item)}
            >
              <td className="px-4 py-3">
                {item.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.coverUrl}
                    alt={`Обложка ${item.title}`}
                    className="h-12 w-12 rounded-md border border-border/80 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
                    no cover
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{item.title}</p>
                {item.description ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.currentPublishedVersionNumber
                  ? `v${item.currentPublishedVersionNumber}`
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-secondary/35 bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                  {mapProgramStatusLabel(item.status)}
                </span>
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
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(item);
                    }}
                  >
                    Open/Edit
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
