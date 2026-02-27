import { AdminProgramDetailsPage } from "@/features/programs/admin-program-details-page";

type AdminProgramDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function AdminProgramDetailsRoutePage({
  params,
}: AdminProgramDetailsRoutePageProps) {
  const { programId } = await params;
  return <AdminProgramDetailsPage programId={programId} />;
}
