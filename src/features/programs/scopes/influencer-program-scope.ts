import {
  createInfluencerProgram,
  getInfluencerProgram,
  searchInfluencerPrograms,
  updateInfluencerProgram,
} from "@/api/influencerPrograms";
import type { ProgramsScopeConfig } from "@/features/programs/types";

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
  },
};
