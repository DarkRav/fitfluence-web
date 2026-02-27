"use client";

import type { AdminWorkoutExerciseRecord } from "@/api/adminWorkouts";

type WorkoutExercisesListProps = {
  items: AdminWorkoutExerciseRecord[];
};

export function WorkoutExercisesList({ items }: WorkoutExercisesListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Exercise</th>
            <th className="px-4 py-3 font-medium">Sets</th>
            <th className="px-4 py-3 font-medium">Reps</th>
            <th className="px-4 py-3 font-medium">Rest</th>
            <th className="px-4 py-3 font-medium">RPE</th>
            <th className="px-4 py-3 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((exercise) => (
            <tr key={exercise.id} className="border-t border-border/80 text-foreground">
              <td className="px-4 py-3">{exercise.orderIndex + 1}</td>
              <td className="px-4 py-3">
                <p className="font-medium">{exercise.exerciseName}</p>
                <p className="text-xs text-muted-foreground">{exercise.exerciseCode}</p>
              </td>
              <td className="px-4 py-3">{exercise.sets}</td>
              <td className="px-4 py-3">
                {exercise.repsMin ?? "-"}
                {exercise.repsMax ? `-${exercise.repsMax}` : ""}
              </td>
              <td className="px-4 py-3">
                {exercise.restSeconds ? `${exercise.restSeconds}s` : "-"}
              </td>
              <td className="px-4 py-3">{exercise.targetRpe ?? "-"}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{exercise.notes ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
