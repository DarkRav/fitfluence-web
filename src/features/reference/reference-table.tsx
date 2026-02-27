"use client";

import { AppButton } from "@/shared/ui";
import type { ReferenceColumn } from "@/features/reference/reference-types";
import {
  TableContainer,
  tableCellClassName,
  tableHeadClassName,
  tableRowClassName,
} from "@/components/ui";

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
    <TableContainer>
      <table className="w-full text-left text-sm">
        <thead className={tableHeadClassName}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${tableCellClassName} font-medium`}>
                {column.label}
              </th>
            ))}
            <th className={`${tableCellClassName} text-right font-medium`}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`${tableRowClassName} cursor-pointer`}
              onClick={() => onEdit(item)}
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={`${tableCellClassName} ${column.className ?? ""}`}
                >
                  {column.render(item)}
                </td>
              ))}
              <td className={tableCellClassName}>
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
    </TableContainer>
  );
}
