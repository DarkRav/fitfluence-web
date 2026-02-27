"use client";

import { AppButton } from "@/shared/ui";
import type { ExerciseCrudItem } from "@/features/exercises/types";

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
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Код</th>
            <th className="px-4 py-3 font-medium">Паттерн</th>
            <th className="px-4 py-3 font-medium">Сложность</th>
            <th className="px-4 py-3 font-medium">Мышцы</th>
            <th className="px-4 py-3 font-medium">Оборудование</th>
            <th className="px-4 py-3 font-medium text-center">Медиа</th>
            {!readOnly ? <th className="px-4 py-3 text-right font-medium">Действия</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10 ${
                readOnly ? "" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!readOnly) {
                  onEdit?.(item);
                }
              }}
            >
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{item.name}</p>
                {item.description ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.code}</td>
              <td className="px-4 py-3">{mapMovementLabel(item.movementPattern)}</td>
              <td className="px-4 py-3">{mapDifficultyLabel(item.difficultyLevel)}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.musclesLabel || "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.equipmentLabel || "—"}
              </td>
              <td className="px-4 py-3 text-center">{item.mediaIds.length}</td>
              {!readOnly ? (
                <td className="px-4 py-3">
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
    </div>
  );
}
