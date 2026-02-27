"use client";

import { WorkoutsListPage } from "@/features/workouts/workouts-list-page";
import { adminWorkoutScope } from "@/features/workouts/scopes/adminWorkoutScope";

type AdminWorkoutsListPageProps = {
  programId: string;
  programVersionId: string;
};

export function AdminWorkoutsListPage({ programId, programVersionId }: AdminWorkoutsListPageProps) {
  return (
    <WorkoutsListPage
      programId={programId}
      programVersionId={programVersionId}
      scope={adminWorkoutScope}
    />
  );
}
