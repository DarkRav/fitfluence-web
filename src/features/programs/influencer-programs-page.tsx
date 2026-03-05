"use client";

import { ProgramListPage } from "@/features/programs/program-list-page";
import { influencerProgramScope } from "@/features/programs/scopes/influencer-program-scope";

export function InfluencerProgramsPage() {
  return <ProgramListPage config={influencerProgramScope} />;
}
