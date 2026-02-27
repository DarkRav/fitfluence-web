import {
  type CreateAdminProgramPayload,
  createAdminProgram,
  getAdminProgram,
  searchAdminPrograms,
  updateAdminProgram,
} from "@/api/adminPrograms";
import { publishAdminProgramVersion, searchAdminProgramVersions } from "@/api/adminProgramVersions";
import type { ProgramCreatePayload, ProgramsScopeConfig } from "@/features/programs/types";

function isAdminCreatePayload(payload: ProgramCreatePayload): payload is CreateAdminProgramPayload {
  return "influencerId" in payload && typeof payload.influencerId === "string";
}

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
    canCreate: true,
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
    create: async (payload) => {
      if (!isAdminCreatePayload(payload)) {
        return {
          ok: false,
          error: {
            kind: "validation" as const,
            message: "Для создания программы администратором нужен influencerId",
          },
        };
      }

      return createAdminProgram(payload);
    },
    searchVersions: searchAdminProgramVersions,
    publishVersion: publishAdminProgramVersion,
  },
};
