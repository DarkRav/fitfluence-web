import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  InfluencerCabinetService,
  type CreateProgramVersionRequest,
  type ProgramVersion,
  type ProgramVersionStatus,
  type UpdateProgramVersionRequest,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type InfluencerProgramVersionStatus = ProgramVersionStatus;

export type InfluencerProgramVersionRecord = {
  id: string;
  programId?: string;
  versionNumber: number;
  status: InfluencerProgramVersionStatus;
  publishedAt?: string;
  level?: string;
  frequencyPerWeek?: number;
  requirements?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type InfluencerProgramVersionsPageResult = {
  items: InfluencerProgramVersionRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type InfluencerProgramVersionsSearchParams = {
  programId: string;
  page: number;
  size: number;
  search?: string;
  status?: InfluencerProgramVersionStatus;
};

export type CreateInfluencerProgramVersionPayload = CreateProgramVersionRequest;

export type UpdateInfluencerProgramVersionPayload = UpdateProgramVersionRequest;

function mapVersion(item: ProgramVersion): InfluencerProgramVersionRecord {
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

function normalizeCreatePayload(
  payload: CreateInfluencerProgramVersionPayload,
): CreateProgramVersionRequest {
  return {
    versionNumber: payload.versionNumber,
    level: payload.level?.trim() || undefined,
    frequencyPerWeek: payload.frequencyPerWeek,
    requirements: payload.requirements,
  };
}

function normalizeUpdatePayload(
  payload: UpdateInfluencerProgramVersionPayload,
): UpdateProgramVersionRequest {
  return {
    level: payload.level?.trim() || undefined,
    frequencyPerWeek: payload.frequencyPerWeek,
    requirements: payload.requirements,
    status: payload.status,
  };
}

function applyLocalFilters(
  versions: InfluencerProgramVersionRecord[],
  params: InfluencerProgramVersionsSearchParams,
): InfluencerProgramVersionRecord[] {
  const query = params.search?.trim().toLowerCase();

  return versions.filter((item) => {
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

  return {
    content: items.slice(start, start + safeSize),
    totalPages: Math.ceil(items.length / safeSize),
  };
}

export async function searchInfluencerProgramVersions(
  params: InfluencerProgramVersionsSearchParams,
): Promise<ApiResult<InfluencerProgramVersionsPageResult>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramsProgramIdGet({
      programId: params.programId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  const allItems = (result.data.versions ?? [])
    .map(mapVersion)
    .sort((left, right) => right.versionNumber - left.versionNumber);
  const filtered = applyLocalFilters(allItems, params);
  const safeSize = params.size || DEFAULT_PAGE_SIZE;
  const paged = paginate(filtered, params.page, safeSize);

  return {
    ok: true,
    data: {
      items: paged.content,
      page: params.page,
      size: safeSize,
      totalElements: filtered.length,
      totalPages: paged.totalPages,
    },
  };
}

export async function createInfluencerProgramVersion(
  programId: string,
  payload: CreateInfluencerProgramVersionPayload,
): Promise<ApiResult<InfluencerProgramVersionRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramsProgramIdVersionsPost({
      programId,
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapVersion(result.data),
  };
}

export async function getInfluencerProgramVersion(
  programVersionId: string,
): Promise<ApiResult<InfluencerProgramVersionRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramVersionsProgramVersionIdGet({
      programVersionId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapVersion(result.data),
  };
}

export async function updateInfluencerProgramVersion(
  programVersionId: string,
  payload: UpdateInfluencerProgramVersionPayload,
): Promise<ApiResult<InfluencerProgramVersionRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramVersionsProgramVersionIdPatch({
      programVersionId,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapVersion(result.data),
  };
}

export async function deleteInfluencerProgramVersion(
  programVersionId: string,
): Promise<ApiResult<InfluencerProgramVersionRecord>> {
  return updateInfluencerProgramVersion(programVersionId, { status: "ARCHIVED" });
}
