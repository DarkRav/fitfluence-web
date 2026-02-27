import { redirect } from "next/navigation";

type AdminWorkoutDetailsLegacyRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
    workoutTemplateId: string;
  }>;
};

export default async function AdminWorkoutDetailsLegacyRoutePage({
  params,
}: AdminWorkoutDetailsLegacyRoutePageProps) {
  const { programId, programVersionId, workoutTemplateId } = await params;
  redirect(
    `/admin/programs/${programId}/workouts/${workoutTemplateId}?version=${programVersionId}`,
  );
}
