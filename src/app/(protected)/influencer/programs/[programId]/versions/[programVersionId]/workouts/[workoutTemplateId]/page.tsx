import { redirect } from "next/navigation";

type InfluencerWorkoutDetailsLegacyRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
    workoutTemplateId: string;
  }>;
};

export async function generateStaticParams() {
  return [
    {
      programId: "__placeholder__",
      programVersionId: "__placeholder__",
      workoutTemplateId: "__placeholder__",
    },
  ];
}

export default async function InfluencerWorkoutDetailsLegacyRoutePage({
  params,
}: InfluencerWorkoutDetailsLegacyRoutePageProps) {
  const { programId, programVersionId, workoutTemplateId } = await params;
  redirect(
    `/influencer/programs/${programId}/workouts/${workoutTemplateId}?version=${programVersionId}`,
  );
}
