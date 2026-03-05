import { redirect } from "next/navigation";

type AdminProgramVersionWorkoutsRoutePageProps = {
  params: Promise<{
    programId: string;
    programVersionId: string;
  }>;
};

export async function generateStaticParams() {
  return [{ programId: "__placeholder__", programVersionId: "__placeholder__" }];
}

export default async function AdminProgramVersionWorkoutsRoutePage({
  params,
}: AdminProgramVersionWorkoutsRoutePageProps) {
  const { programId, programVersionId } = await params;
  redirect(
    `/admin/programs?programId=${encodeURIComponent(programId)}&tab=workouts&version=${encodeURIComponent(programVersionId)}`,
  );
}
