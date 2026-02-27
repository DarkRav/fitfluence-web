import {
  createAdminProgressionPolicy,
  deleteAdminProgressionPolicy,
  getAdminProgressionPolicy,
  searchAdminProgressionPolicies,
  updateAdminProgressionPolicy,
} from "@/api/adminProgression";
import type { ProgressionScopeConfig } from "@/features/progression/types";

export const adminProgressionScope: ProgressionScopeConfig = {
  scope: "admin",
  title: "Progression",
  subtitle: "Управление политиками прогрессии платформы.",
  searchPlaceholder: "Поиск по code или названию",
  createButtonLabel: "Create Policy",
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
