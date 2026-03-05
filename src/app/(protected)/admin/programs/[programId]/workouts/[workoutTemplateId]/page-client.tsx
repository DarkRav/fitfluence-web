"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AdminWorkoutDetailsPage } from "@/features/workouts/admin/admin-workout-details-page";

export function AdminWorkoutDetailsRouteClientPage() {
  const params = useParams<{ programId: string; workoutTemplateId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const version = searchParams.get("version");
  const programId = params.programId;
  const workoutTemplateId = params.workoutTemplateId;

  useEffect(() => {
    if (!version && typeof programId === "string" && programId.length > 0) {
      router.replace(`/admin/programs/${encodeURIComponent(programId)}`);
    }
  }, [programId, router, version]);

  if (typeof programId !== "string" || typeof workoutTemplateId !== "string" || !version) {
    return null;
  }

  return (
    <AdminWorkoutDetailsPage
      programId={programId}
      programVersionId={version}
      workoutTemplateId={workoutTemplateId}
    />
  );
}
