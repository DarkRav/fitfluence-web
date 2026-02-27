import { redirect } from "next/navigation";
import { WorkoutDetailsPage } from "@/features/workouts/workout-details-page";

type InfluencerWorkoutDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
    workoutTemplateId: string;
  }>;
  searchParams: Promise<{
    version?: string;
  }>;
};

export default async function InfluencerWorkoutDetailsRoutePage({
  params,
  searchParams,
}: InfluencerWorkoutDetailsRoutePageProps) {
  const { programId, workoutTemplateId } = await params;
  const { version } = await searchParams;

  if (!version) {
    redirect(`/influencer/programs/${programId}`);
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
