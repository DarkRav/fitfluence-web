import { redirect } from "next/navigation";
import { AdminWorkoutDetailsPage } from "@/features/workouts/admin/admin-workout-details-page";

type AdminWorkoutDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
    workoutTemplateId: string;
  }>;
  searchParams: Promise<{
    version?: string;
  }>;
};

export default async function AdminWorkoutDetailsRoutePage({
  params,
  searchParams,
}: AdminWorkoutDetailsRoutePageProps) {
  const { programId, workoutTemplateId } = await params;
  const { version } = await searchParams;

  if (!version) {
    redirect(`/admin/programs/${programId}`);
  }

  return (
    <AdminWorkoutDetailsPage
      programId={programId}
      programVersionId={version}
      workoutTemplateId={workoutTemplateId}
    />
  );
}
