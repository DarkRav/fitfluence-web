import { WorkoutDetailsPage } from "@/features/workouts/workout-details-page";
import { influencerWorkoutScope } from "@/features/workouts/scopes/influencerWorkoutScope";

type InfluencerWorkoutDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
    workoutTemplateId: string;
  }>;
};

export default async function InfluencerWorkoutDetailsRoutePage({
  params,
}: InfluencerWorkoutDetailsRoutePageProps) {
  const { programId, programVersionId, workoutTemplateId } = await params;

  return (
    <WorkoutDetailsPage
      programId={programId}
      programVersionId={programVersionId}
      workoutTemplateId={workoutTemplateId}
      scope={influencerWorkoutScope}
    />
  );
}
