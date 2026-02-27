import { WorkoutsListPage } from "@/features/workouts";
import { influencerWorkoutScope } from "@/features/workouts/scopes/influencerWorkoutScope";

type InfluencerProgramVersionWorkoutsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
  }>;
};

export default async function InfluencerProgramVersionWorkoutsRoutePage({
  params,
}: InfluencerProgramVersionWorkoutsRoutePageProps) {
  const { programId, programVersionId } = await params;

  return (
    <WorkoutsListPage
      programId={programId}
      programVersionId={programVersionId}
      scope={influencerWorkoutScope}
    />
  );
}
