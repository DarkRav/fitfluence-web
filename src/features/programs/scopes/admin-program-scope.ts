import { getAdminProgram, searchAdminPrograms, updateAdminProgram } from "@/api/adminPrograms";
import { publishAdminProgramVersion, searchAdminProgramVersions } from "@/api/adminProgramVersions";
import type { ProgramsScopeConfig } from "@/features/programs/types";

export const adminProgramScope: ProgramsScopeConfig = {
  scope: "admin",
  title: "Programs",
  subtitle: "Управление программами платформы.",
  searchPlaceholder: "Поиск по названию программы",
  createButtonLabel: "Create Program",
  queryKeyPrefix: ["programs", "admin"],
  routes: {
    list: "/admin/programs",
    details: (programId) => `/admin/programs/${programId}`,
  },
  capabilities: {
    canCreate: false,
    canEdit: true,
    showOwner: true,
    showVersions: true,
    canPublish: true,
    enableStatusFilter: true,
  },
  api: {
    search: searchAdminPrograms,
    get: getAdminProgram,
    update: updateAdminProgram,
    searchVersions: searchAdminProgramVersions,
    publishVersion: publishAdminProgramVersion,
  },
};
