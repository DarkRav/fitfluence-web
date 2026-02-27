import {
  createInfluencerProgram,
  getInfluencerProgram,
  searchInfluencerPrograms,
  updateInfluencerProgram,
} from "@/api/influencerPrograms";
import {
  createInfluencerProgramVersion,
  deleteInfluencerProgramVersion,
  searchInfluencerProgramVersions,
  updateInfluencerProgramVersion,
  type InfluencerProgramVersionsSearchParams,
} from "@/api/influencerProgramVersions";
import type { ProgramsScopeConfig } from "@/features/programs/types";

function isInfluencerVersionParams(
  params: Parameters<NonNullable<ProgramsScopeConfig["api"]["searchVersions"]>>[0],
): params is InfluencerProgramVersionsSearchParams {
  return typeof params.programId === "string";
}

export const influencerProgramScope: ProgramsScopeConfig = {
  scope: "influencer",
  title: "Programs",
  subtitle: "Управляйте метаданными программ инфлюэнсера.",
  searchPlaceholder: "Поиск по названию программы",
  createButtonLabel: "Create Program",
  queryKeyPrefix: ["programs", "influencer"],
  routes: {
    list: "/influencer/programs",
    details: (programId) => `/influencer/programs/${programId}`,
  },
  capabilities: {
    canCreate: true,
    canEdit: true,
    showOwner: false,
    showVersions: true,
    canPublish: false,
    enableStatusFilter: false,
  },
  api: {
    search: searchInfluencerPrograms,
    get: getInfluencerProgram,
    update: updateInfluencerProgram,
    create: createInfluencerProgram,
    searchVersions: async (params) => {
      if (!isInfluencerVersionParams(params)) {
        return {
          ok: false,
          error: {
            kind: "validation" as const,
            message: "Для influencer versions требуется programId",
          },
        };
      }

      return searchInfluencerProgramVersions(params);
    },
    createVersion: createInfluencerProgramVersion,
    updateVersion: updateInfluencerProgramVersion,
    deleteVersion: deleteInfluencerProgramVersion,
  },
};
