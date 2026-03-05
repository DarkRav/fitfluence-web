"use client";

import { ProgramListPage } from "@/features/programs/program-list-page";
import { adminProgramScope } from "@/features/programs/scopes/admin-program-scope";

export function AdminProgramsPage() {
  return <ProgramListPage config={adminProgramScope} />;
}
