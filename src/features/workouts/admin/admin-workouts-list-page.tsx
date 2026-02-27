"use client";

import { WorkoutsListPage } from "@/features/workouts/workouts-list-page";

type AdminWorkoutsListPageProps = {
  programId: string;
  programVersionId: string;
};

export function AdminWorkoutsListPage({ programId, programVersionId }: AdminWorkoutsListPageProps) {
  return (
    <WorkoutsListPage programId={programId} programVersionId={programVersionId} scopeName="admin" />
  );
}
