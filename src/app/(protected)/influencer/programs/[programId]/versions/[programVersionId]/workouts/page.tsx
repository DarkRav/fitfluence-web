import { redirect } from "next/navigation";

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
  redirect(
    `/influencer/programs/${encodeURIComponent(programId)}?tab=workouts&version=${encodeURIComponent(programVersionId)}`,
  );
}
