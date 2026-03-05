"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { WorkoutDetailsPage } from "@/features/workouts/workout-details-page";

export function InfluencerWorkoutDetailsRouteClientPage() {
  const params = useParams<{ programId: string; workoutTemplateId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const version = searchParams.get("version");
  const programId = params.programId;
  const workoutTemplateId = params.workoutTemplateId;

  useEffect(() => {
    if (!version && typeof programId === "string" && programId.length > 0) {
      router.replace(`/influencer/programs?programId=${encodeURIComponent(programId)}`);
    }
  }, [programId, router, version]);

  if (typeof programId !== "string" || typeof workoutTemplateId !== "string" || !version) {
    return null;
  }

  return (
    <WorkoutDetailsPage
      programId={programId}
      programVersionId={version}
      workoutTemplateId={workoutTemplateId}
      scopeName="influencer"
    />
  );
}
