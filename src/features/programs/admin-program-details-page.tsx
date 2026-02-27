"use client";

import { ProgramDetailsPage } from "@/features/programs/program-details-page";
import { adminProgramScope } from "@/features/programs/scopes/admin-program-scope";

type AdminProgramDetailsPageProps = {
  programId: string;
};

export function AdminProgramDetailsPage({ programId }: AdminProgramDetailsPageProps) {
  return <ProgramDetailsPage programId={programId} config={adminProgramScope} />;
}
