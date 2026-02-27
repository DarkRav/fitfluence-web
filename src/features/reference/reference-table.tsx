"use client";

import { AppButton } from "@/shared/ui";
import type { ReferenceColumn } from "@/features/reference/reference-types";

type ReferenceTableProps<TItem extends { id: string }> = {
  items: TItem[];
  columns: ReferenceColumn<TItem>[];
  onEdit: (item: TItem) => void;
  onDelete: (item: TItem) => void;
};

export function ReferenceTable<TItem extends { id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
}: ReferenceTableProps<TItem>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
              onClick={() => onEdit(item)}
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={`px-4 py-3 ${column.className ?? ""}`}
                >
                  {column.render(item)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <AppButton
                    type="button"
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(item);
                    }}
                  >
                    Изменить
                  </AppButton>
                  <AppButton
                    type="button"
                    variant="destructive"
                    className="h-9 px-3 text-xs"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(item);
                    }}
                  >
                    Удалить
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
