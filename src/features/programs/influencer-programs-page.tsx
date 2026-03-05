"use client";

import { useSearchParams } from "next/navigation";
import { InfluencerProgramDetailsPage } from "@/features/programs/influencer-program-details-page";
import { ProgramListPage } from "@/features/programs/program-list-page";
import { influencerProgramScope } from "@/features/programs/scopes/influencer-program-scope";

export function InfluencerProgramsPage() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");

  if (programId) {
    return <InfluencerProgramDetailsPage programId={programId} />;
  }

  return <ProgramListPage config={influencerProgramScope} />;
}
