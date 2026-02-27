import { ProgramDetailsPage } from "@/features/programs/program-details-page";

type InfluencerProgramDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function InfluencerProgramDetailsRoutePage({
  params,
}: InfluencerProgramDetailsRoutePageProps) {
  const { programId } = await params;
  return <ProgramDetailsPage programId={programId} />;
}
