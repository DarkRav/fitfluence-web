"use client";

import { useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import type { AdminWorkoutExerciseRecord } from "@/api/adminWorkouts";

type ReorderableExercisesListProps = {
  exercises: AdminWorkoutExerciseRecord[];
  isReordering: boolean;
  onReorder: (nextExercises: AdminWorkoutExerciseRecord[]) => void;
  renderExercise: (exercise: AdminWorkoutExerciseRecord) => React.ReactNode;
};

function withOrderIndex(exercises: AdminWorkoutExerciseRecord[]): AdminWorkoutExerciseRecord[] {
  return exercises.map((exercise, index) => ({
    ...exercise,
    orderIndex: index,
  }));
}

function moveItem(
  exercises: AdminWorkoutExerciseRecord[],
  sourceId: string,
  targetId: string,
): AdminWorkoutExerciseRecord[] {
  if (sourceId === targetId) {
    return exercises;
  }

  const sourceIndex = exercises.findIndex((item) => item.id === sourceId);
  const targetIndex = exercises.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) {
    return exercises;
  }

  const next = [...exercises];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);

  return withOrderIndex(next);
}

export function ReorderableExercisesList({
  exercises,
  isReordering,
  onReorder,
  renderExercise,
}: ReorderableExercisesListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const sortedExercises = useMemo(
    () => [...exercises].sort((left, right) => left.orderIndex - right.orderIndex),
    [exercises],
  );

  return (
    <div className="space-y-3">
      {sortedExercises.map((exercise) => (
        <div
          key={exercise.id}
          draggable={!isReordering}
          onDragStart={() => setDraggedId(exercise.id)}
          onDragOver={(event) => event.preventDefault()}
          onDragEnd={() => setDraggedId(null)}
          onDrop={(event) => {
            event.preventDefault();
            if (!draggedId || isReordering) {
              return;
            }

            const reordered = moveItem(sortedExercises, draggedId, exercise.id);
            if (reordered !== sortedExercises) {
              onReorder(reordered);
            }
            setDraggedId(null);
          }}
          className={`rounded-xl border border-border p-1 transition-colors ${
            draggedId === exercise.id ? "bg-secondary/10" : "bg-transparent"
          }`}
        >
          <div className="mb-1 flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
            <GripVertical className="h-4 w-4" />
            <span>Drag to reorder</span>
          </div>
          {renderExercise(exercise)}
        </div>
      ))}
    </div>
  );
}
