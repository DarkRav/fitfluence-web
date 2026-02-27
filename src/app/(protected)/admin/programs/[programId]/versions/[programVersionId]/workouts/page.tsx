import { AdminWorkoutsListPage } from "@/features/workouts/admin";

type AdminProgramVersionWorkoutsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
  }>;
};

export default async function AdminProgramVersionWorkoutsRoutePage({
  params,
}: AdminProgramVersionWorkoutsRoutePageProps) {
  const { programId, programVersionId } = await params;

  return <AdminWorkoutsListPage programId={programId} programVersionId={programVersionId} />;
}
