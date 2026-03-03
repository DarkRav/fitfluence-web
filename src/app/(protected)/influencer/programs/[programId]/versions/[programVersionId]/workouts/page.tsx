import { redirect } from "next/navigation";

type InfluencerProgramVersionWorkoutsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
  }>;
};

export async function generateStaticParams() {
  return [{ programId: "__placeholder__", programVersionId: "__placeholder__" }];
}

export default async function InfluencerProgramVersionWorkoutsRoutePage({
  params,
}: InfluencerProgramVersionWorkoutsRoutePageProps) {
  const { programId, programVersionId } = await params;
  redirect(`/influencer/programs/${programId}?tab=workouts&version=${programVersionId}`);
}
