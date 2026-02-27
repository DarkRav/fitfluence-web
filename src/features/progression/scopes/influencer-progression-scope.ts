import {
  getInfluencerProgressionPolicy,
  searchInfluencerProgressionPolicies,
} from "@/api/influencerProgression";
import type { ProgressionScopeConfig } from "@/features/progression/types";

export const influencerProgressionScope: ProgressionScopeConfig = {
  scope: "influencer",
  title: "Progression",
  subtitle: "Просматривайте доступные политики прогрессии для своих программ.",
  searchPlaceholder: "Поиск по code или названию",
  createButtonLabel: "Create Policy",
  queryKeyPrefix: ["progression", "influencer"],
  capabilities: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canFilterOwnerType: false,
    showOwnerColumns: true,
  },
  api: {
    search: ({ page, size, search, filters }) =>
      searchInfluencerProgressionPolicies({
        page,
        size,
        search,
        type: filters.type,
        status: filters.status,
      }),
    get: getInfluencerProgressionPolicy,
  },
};
