"use client";

import { ProgramDetailsPage } from "@/features/programs/program-details-page";
import { influencerProgramScope } from "@/features/programs/scopes/influencer-program-scope";

type InfluencerProgramDetailsPageProps = {
  programId: string;
};

export function InfluencerProgramDetailsPage({ programId }: InfluencerProgramDetailsPageProps) {
  return <ProgramDetailsPage programId={programId} config={influencerProgramScope} />;
}
