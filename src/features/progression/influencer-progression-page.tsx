"use client";

import { ProgressionCrudPage } from "@/features/progression/progression-crud-page";
import { influencerProgressionScope } from "@/features/progression/scopes/influencer-progression-scope";

export function InfluencerProgressionPage() {
  return <ProgressionCrudPage config={influencerProgressionScope} />;
}
