"use client";

import { WorkoutDetailsPage } from "@/features/workouts/workout-details-page";
import { adminWorkoutScope } from "@/features/workouts/scopes/adminWorkoutScope";

type AdminWorkoutDetailsPageProps = {
  programId: string;
  programVersionId: string;
  workoutTemplateId: string;
};

export function AdminWorkoutDetailsPage({
  programId,
  programVersionId,
  workoutTemplateId,
}: AdminWorkoutDetailsPageProps) {
  return (
    <WorkoutDetailsPage
      programId={programId}
      programVersionId={programVersionId}
      workoutTemplateId={workoutTemplateId}
      scope={adminWorkoutScope}
    />
  );
}
