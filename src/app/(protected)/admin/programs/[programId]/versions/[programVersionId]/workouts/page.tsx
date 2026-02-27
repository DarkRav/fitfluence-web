import { redirect } from "next/navigation";

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
  redirect(`/admin/programs/${programId}?tab=workouts&version=${programVersionId}`);
}
