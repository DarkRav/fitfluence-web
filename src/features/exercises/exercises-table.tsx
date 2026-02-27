"use client";

import { AppButton } from "@/shared/ui";
import type { ExerciseCrudItem } from "@/features/exercises/types";
import {
  TableContainer,
  tableCellClassName,
  tableHeadClassName,
  tableRowClassName,
} from "@/components/ui";

function mapDifficultyLabel(value?: ExerciseCrudItem["difficultyLevel"]): string {
  if (value === "BEGINNER") {
    return "Начальный";
  }

  if (value === "INTERMEDIATE") {
    return "Средний";
  }

  if (value === "ADVANCED") {
    return "Продвинутый";
  }

  return "—";
}

function mapMovementLabel(value?: ExerciseCrudItem["movementPattern"]): string {
  if (value === "PUSH") {
    return "Жим";
  }

  if (value === "PULL") {
    return "Тяга";
  }

  if (value === "SQUAT") {
    return "Присед";
  }

  if (value === "HINGE") {
    return "Наклон";
  }

  if (value === "OTHER") {
    return "Другое";
  }

  return "—";
}

type ExercisesTableProps = {
  items: ExerciseCrudItem[];
  onEdit?: (item: ExerciseCrudItem) => void;
  onDelete?: (item: ExerciseCrudItem) => void;
  readOnly?: boolean;
};

export function ExercisesTable({ items, onEdit, onDelete, readOnly = false }: ExercisesTableProps) {
  return (
    <TableContainer>
      <table className="w-full text-left text-sm">
        <thead className={tableHeadClassName}>
          <tr>
            <th className={`${tableCellClassName} font-medium`}>Название</th>
            <th className={`${tableCellClassName} font-medium`}>Паттерн</th>
            <th className={`${tableCellClassName} font-medium`}>Сложность</th>
            <th className={`${tableCellClassName} font-medium`}>Мышцы</th>
            <th className={`${tableCellClassName} font-medium`}>Оборудование</th>
            <th className={`${tableCellClassName} text-center font-medium`}>Медиа</th>
            {!readOnly ? (
              <th className={`${tableCellClassName} text-right font-medium`}>Действия</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`${tableRowClassName} ${readOnly ? "" : "cursor-pointer"}`}
              onClick={() => {
                if (!readOnly) {
                  onEdit?.(item);
                }
              }}
            >
              <td className={tableCellClassName}>
                <p className="font-medium text-foreground">{item.name}</p>
                {item.description ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </td>
              <td className={tableCellClassName}>{mapMovementLabel(item.movementPattern)}</td>
              <td className={tableCellClassName}>{mapDifficultyLabel(item.difficultyLevel)}</td>
              <td className={`${tableCellClassName} text-xs text-muted-foreground`}>
                {item.musclesLabel || "—"}
              </td>
              <td className={`${tableCellClassName} text-xs text-muted-foreground`}>
                {item.equipmentLabel || "—"}
              </td>
              <td className={`${tableCellClassName} text-center`}>{item.mediaIds.length}</td>
              {!readOnly ? (
                <td className={tableCellClassName}>
                  <div className="flex items-center justify-end gap-2">
                    <AppButton
                      type="button"
                      variant="secondary"
                      className="h-9 px-3 text-xs"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit?.(item);
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
                        onDelete?.(item);
                      }}
                    >
                      Архивировать
                    </AppButton>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
