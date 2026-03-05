import { redirect } from "next/navigation";

type InfluencerWorkoutDetailsLegacyRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
    workoutTemplateId: string;
  }>;
};

export default async function InfluencerWorkoutDetailsLegacyRoutePage({
  params,
}: InfluencerWorkoutDetailsLegacyRoutePageProps) {
  const { programId, programVersionId, workoutTemplateId } = await params;
  redirect(
    `/influencer/programs/${encodeURIComponent(programId)}/workouts/${encodeURIComponent(workoutTemplateId)}?version=${encodeURIComponent(programVersionId)}`,
  );
}
