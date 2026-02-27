import { WorkoutsListPage } from "@/features/workouts";

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
      scopeName="influencer"
    />
  );
}
