"use client";

import { ExercisesCrudPage, influencerExerciseScope } from "@/features/exercises";

export default function InfluencerExercisesPage() {
  return <ExercisesCrudPage config={influencerExerciseScope} />;
}
