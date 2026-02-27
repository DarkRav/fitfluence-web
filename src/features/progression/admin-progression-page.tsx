"use client";

import { ProgressionCrudPage } from "@/features/progression/progression-crud-page";
import { adminProgressionScope } from "@/features/progression/scopes/admin-progression-scope";

export function AdminProgressionPage() {
  return <ProgressionCrudPage config={adminProgressionScope} />;
}
