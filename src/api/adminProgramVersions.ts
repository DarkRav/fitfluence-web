import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProgramManagementService,
  type ProgramVersion,
  type ProgramVersionStatus,
  type PublishProgramVersionRequest,
  type UpdateProgramVersionRequest,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type AdminProgramVersionStatus = ProgramVersionStatus;

export type AdminProgramVersionRecord = {
  id: string;
  programId?: string;
  versionNumber: number;
  status: AdminProgramVersionStatus;
  publishedAt?: string;
  level?: string;
  frequencyPerWeek?: number;
  requirements?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProgramVersionsPageResult = {
  items: AdminProgramVersionRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminProgramVersionsSearchParams = {
  programId?: string;
  page: number;
  size: number;
  search?: string;
  status?: AdminProgramVersionStatus;
};

export type UpdateAdminProgramVersionPayload = {
  level?: string;
  frequencyPerWeek?: number;
  requirements?: Record<string, unknown>;
  status?: AdminProgramVersionStatus;
};

function mapProgramVersion(item: ProgramVersion): AdminProgramVersionRecord {
  return {
    id: item.id,
    programId: item.programId,
    versionNumber: item.versionNumber,
    status: item.status,
    publishedAt: item.publishedAt,
    level: item.level,
    frequencyPerWeek: item.frequencyPerWeek,
    requirements: item.requirements as Record<string, unknown> | undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function applyLocalFilters(
  versions: AdminProgramVersionRecord[],
  params: AdminProgramVersionsSearchParams,
): AdminProgramVersionRecord[] {
  const query = params.search?.trim().toLowerCase();

  return versions.filter((item) => {
    if (params.programId && item.programId !== params.programId) {
      return false;
    }

    if (params.status && item.status !== params.status) {
      return false;
    }

    if (query) {
      const haystack = `v${item.versionNumber} ${item.level ?? ""}`.toLowerCase();
      return haystack.includes(query);
    }

    return true;
  });
}

function paginate<T>(items: T[], page: number, size: number): { content: T[]; totalPages: number } {
  const safeSize = Math.max(1, size || DEFAULT_PAGE_SIZE);
  const start = page * safeSize;
  const content = items.slice(start, start + safeSize);
  const totalPages = Math.ceil(items.length / safeSize);

  return {
    content,
    totalPages,
  };
}

function normalizeUpdatePayload(
  payload: UpdateAdminProgramVersionPayload,
): UpdateProgramVersionRequest {
  return {
    level: payload.level?.trim() || undefined,
    frequencyPerWeek: payload.frequencyPerWeek,
    requirements: payload.requirements,
    status: payload.status,
  };
}

export async function searchAdminProgramVersions(
  params: AdminProgramVersionsSearchParams,
): Promise<ApiResult<AdminProgramVersionsPageResult>> {
  if (!params.programId) {
    return {
      ok: true,
      data: {
        items: [],
        page: params.page,
        size: params.size || DEFAULT_PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }

  const result = await toApiResult(
    ProgramManagementService.adminProgramsProgramIdVersionsGet({
      programId: params.programId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  const filtered = applyLocalFilters((result.data ?? []).map(mapProgramVersion), params);
  const pageSize = params.size || DEFAULT_PAGE_SIZE;
  const paged = paginate(filtered, params.page, pageSize);

  return {
    ok: true,
    data: {
      items: paged.content,
      page: params.page,
      size: pageSize,
      totalElements: filtered.length,
      totalPages: paged.totalPages,
    },
  };
}

export async function getAdminProgramVersion(
  programVersionId: string,
): Promise<ApiResult<AdminProgramVersionRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdGet({
      programVersionId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgramVersion(result.data),
  };
}

export async function updateAdminProgramVersion(
  programVersionId: string,
  payload: UpdateAdminProgramVersionPayload,
): Promise<ApiResult<AdminProgramVersionRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdPatch({
      programVersionId,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgramVersion(result.data),
  };
}

export async function publishAdminProgramVersion(
  programVersionId: string,
  payload?: PublishProgramVersionRequest,
): Promise<ApiResult<AdminProgramVersionRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdPublishPost({
      programVersionId,
      requestBody: payload,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgramVersion(result.data),
  };
}
