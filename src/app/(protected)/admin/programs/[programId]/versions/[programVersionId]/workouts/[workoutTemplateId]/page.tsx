import { AdminWorkoutDetailsPage } from "@/features/workouts/admin/admin-workout-details-page";

type AdminWorkoutDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
    workoutTemplateId: string;
  }>;
};

export default async function AdminWorkoutDetailsRoutePage({
  params,
}: AdminWorkoutDetailsRoutePageProps) {
  const { programId, programVersionId, workoutTemplateId } = await params;

  return (
    <AdminWorkoutDetailsPage
      programId={programId}
      programVersionId={programVersionId}
      workoutTemplateId={workoutTemplateId}
    />
  );
}
