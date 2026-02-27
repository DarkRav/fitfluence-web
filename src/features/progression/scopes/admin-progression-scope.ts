import {
  createAdminProgressionPolicy,
  deleteAdminProgressionPolicy,
  getAdminProgressionPolicy,
  searchAdminProgressionPolicies,
  updateAdminProgressionPolicy,
} from "@/api/adminProgression";
import { ru } from "@/localization/ru";
import type { ProgressionScopeConfig } from "@/features/progression/types";

export const adminProgressionScope: ProgressionScopeConfig = {
  scope: "admin",
  title: ru.progression.title,
  subtitle: ru.progression.subtitleAdmin,
  searchPlaceholder: ru.progression.searchPlaceholder,
  createButtonLabel: ru.common.actions.create,
  queryKeyPrefix: ["progression", "admin"],
  capabilities: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canFilterOwnerType: true,
    showOwnerColumns: true,
  },
  api: {
    search: ({ page, size, search, filters }) =>
      searchAdminProgressionPolicies({
        page,
        size,
        search,
        type: filters.type,
        status: filters.status,
        ownerType: filters.ownerType,
      }),
    get: getAdminProgressionPolicy,
    create: createAdminProgressionPolicy,
    update: updateAdminProgressionPolicy,
    remove: deleteAdminProgressionPolicy,
  },
};
