import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProgramManagementService,
  type CreateProgramRequest,
  type ProgramDetails,
  type ProgramListItem,
  type ProgramStatus,
  type ProgramsSearchRequest,
  type UpdateProgramRequest,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type AdminProgramStatus = ProgramStatus;

export type AdminProgramRecord = {
  id: string;
  title: string;
  description?: string;
  status: AdminProgramStatus;
  goals: string[];
  coverMediaId?: string;
  coverUrl?: string;
  mediaIds: string[];
  influencerId?: string;
  influencerDisplayName?: string;
  currentPublishedVersionId?: string;
  currentPublishedVersionNumber?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProgramsPageResult = {
  items: AdminProgramRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminProgramsSearchParams = {
  page: number;
  size: number;
  search?: string;
  status?: AdminProgramStatus;
};

export type CreateAdminProgramPayload = {
  influencerId: string;
  title: string;
  description?: string;
  goals?: string[];
  coverMediaId?: string;
  mediaIds?: string[];
};

export type UpdateAdminProgramPayload = {
  title?: string;
  description?: string;
  goals?: string[];
  status?: AdminProgramStatus;
  currentPublishedVersionId?: string;
  coverMediaId?: string;
  mediaIds?: string[];
};

function resolveBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl && baseUrl.length > 0 ? baseUrl : "http://localhost:9876";
}

function resolveMediaUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${resolveBaseUrl()}${normalizedPath}`;
}

function normalizeGoals(goals?: string[]): string[] | undefined {
  if (!goals) {
    return undefined;
  }

  const normalized = goals.map((item) => item.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}

function resolveMediaIds(coverMediaId?: string, mediaIds?: string[]): string[] | undefined {
  const normalized = (mediaIds ?? []).map((id) => id.trim()).filter(Boolean);
  const coverId = coverMediaId?.trim();

  if (coverId) {
    return [coverId, ...normalized.filter((id) => id !== coverId)];
  }

  return normalized.length > 0 ? normalized : undefined;
}

function mapProgram(item: ProgramListItem | ProgramDetails): AdminProgramRecord {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    goals: item.goals ?? [],
    coverMediaId: item.cover?.id,
    coverUrl: resolveMediaUrl(item.cover?.url),
    mediaIds: (item.media ?? []).map((media) => media.id),
    influencerId: item.influencer?.id,
    influencerDisplayName: item.influencer?.displayName,
    currentPublishedVersionId: item.currentPublishedVersion?.id,
    currentPublishedVersionNumber: item.currentPublishedVersion?.versionNumber,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function buildSearchRequest(params: AdminProgramsSearchParams): ProgramsSearchRequest {
  return {
    page: params.page,
    size: params.size || DEFAULT_PAGE_SIZE,
    filter: {
      search: params.search?.trim() || undefined,
      status: params.status,
    },
  };
}

function normalizeCreatePayload(payload: CreateAdminProgramPayload): CreateProgramRequest {
  return {
    influencerId: payload.influencerId.trim(),
    title: payload.title.trim(),
    description: payload.description?.trim() || undefined,
    goals: normalizeGoals(payload.goals),
    mediaIds: resolveMediaIds(payload.coverMediaId, payload.mediaIds),
  };
}

function normalizeUpdatePayload(payload: UpdateAdminProgramPayload): UpdateProgramRequest {
  return {
    title: payload.title?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    goals: normalizeGoals(payload.goals),
    status: payload.status,
    currentPublishedVersionId: payload.currentPublishedVersionId?.trim() || undefined,
    mediaIds: resolveMediaIds(payload.coverMediaId, payload.mediaIds),
  };
}

export async function searchAdminPrograms(
  params: AdminProgramsSearchParams,
): Promise<ApiResult<AdminProgramsPageResult>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramsSearchPost({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: {
      items: (result.data.content ?? []).map(mapProgram),
      page: result.data.metadata.page,
      size: result.data.metadata.size,
      totalElements: result.data.metadata.totalElements,
      totalPages: result.data.metadata.totalPages,
    },
  };
}

export async function createAdminProgram(
  payload: CreateAdminProgramPayload,
): Promise<ApiResult<AdminProgramRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramsPost({
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgram(result.data),
  };
}

export async function getAdminProgram(programId: string): Promise<ApiResult<AdminProgramRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramsProgramIdGet({
      programId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgram(result.data),
  };
}

export async function updateAdminProgram(
  programId: string,
  payload: UpdateAdminProgramPayload,
): Promise<ApiResult<AdminProgramRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramsProgramIdPatch({
      programId,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProgram(result.data),
  };
}
