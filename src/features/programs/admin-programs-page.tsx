"use client";

import { useSearchParams } from "next/navigation";
import { AdminProgramDetailsPage } from "@/features/programs/admin-program-details-page";
import { ProgramListPage } from "@/features/programs/program-list-page";
import { adminProgramScope } from "@/features/programs/scopes/admin-program-scope";

export function AdminProgramsPage() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");

  if (programId) {
    return <AdminProgramDetailsPage programId={programId} />;
  }

  return <ProgramListPage config={adminProgramScope} />;
}
