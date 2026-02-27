import {
  getInfluencerProgressionPolicy,
  searchInfluencerProgressionPolicies,
} from "@/api/influencerProgression";
import { ru } from "@/localization/ru";
import type { ProgressionScopeConfig } from "@/features/progression/types";

export const influencerProgressionScope: ProgressionScopeConfig = {
  scope: "influencer",
  title: ru.progression.title,
  subtitle: ru.progression.subtitleInfluencer,
  searchPlaceholder: ru.progression.searchPlaceholder,
  createButtonLabel: ru.common.actions.create,
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
