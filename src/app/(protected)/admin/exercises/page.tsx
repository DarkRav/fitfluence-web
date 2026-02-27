"use client";

import { ExercisesCrudPage, adminExerciseScope } from "@/features/exercises";

export default function AdminExercisesPage() {
  return <ExercisesCrudPage config={adminExerciseScope} />;
}
