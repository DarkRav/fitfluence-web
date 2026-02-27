import { InfluencerProgramDetailsPage } from "@/features/programs/influencer-program-details-page";

type InfluencerProgramDetailsRoutePageProps = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function InfluencerProgramDetailsRoutePage({
  params,
}: InfluencerProgramDetailsRoutePageProps) {
  const { programId } = await params;
  return <InfluencerProgramDetailsPage programId={programId} />;
}
