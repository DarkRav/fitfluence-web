import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  MusclesService,
  type CreateMuscleRequest,
  type Muscle,
  type MuscleGroup,
  type UpdateMuscleRequest,
} from "@/api/gen";

configureOpenApiClient();

export type MuscleRecord = {
  id: string;
  code: string;
  name: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  mediaCount: number;
  mediaIds: string[];
};

export type MuscleGroupValue = MuscleGroup;

export type MusclePageResult = {
  items: MuscleRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type MuscleSearchParams = {
  search?: string;
  page?: number;
  size?: number;
};

export type CreateMusclePayload = {
  code: string;
  name: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  mediaIds?: string[];
};

export type UpdateMusclePayload = {
  name?: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  mediaIds?: string[];
};

const DEFAULT_PAGE_SIZE = 20;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;

function normalizePageSize(value?: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_PAGE_SIZE;
  }

  const rounded = Math.trunc(value);
  return Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, rounded));
}

function normalizePage(value?: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

function mapMuscle(item: Muscle): MuscleRecord {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    muscleGroup: item.muscleGroup,
    description: item.description,
    mediaCount: item.media?.length ?? 0,
    mediaIds: (item.media ?? []).map((media) => media.id),
  };
}

function normalizeCreatePayload(payload: CreateMusclePayload): CreateMuscleRequest {
  return {
    code: payload.code.trim(),
    name: payload.name.trim(),
    muscleGroup: payload.muscleGroup,
    description: payload.description?.trim() || undefined,
    mediaIds: payload.mediaIds,
  };
}

function normalizeUpdatePayload(payload: UpdateMusclePayload): UpdateMuscleRequest {
  return {
    name: payload.name?.trim() || undefined,
    muscleGroup: payload.muscleGroup,
    description: payload.description?.trim() || undefined,
    mediaIds: payload.mediaIds,
  };
}

export async function searchMuscles(
  params: MuscleSearchParams,
): Promise<ApiResult<MusclePageResult>> {
  const result = await toApiResult(
    MusclesService.musclesSearch({
      requestBody: {
        filter: params.search?.trim()
          ? {
              search: params.search.trim(),
            }
          : undefined,
        page: normalizePage(params.page),
        size: normalizePageSize(params.size),
      },
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: {
      items: (result.data.content ?? []).map(mapMuscle),
      page: result.data.metadata.page,
      size: result.data.metadata.size,
      totalElements: result.data.metadata.totalElements,
      totalPages: result.data.metadata.totalPages,
    },
  };
}

export async function createMuscle(payload: CreateMusclePayload): Promise<ApiResult<MuscleRecord>> {
  const result = await toApiResult(
    MusclesService.musclesPost({
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMuscle(result.data),
  };
}

export async function updateMuscle(
  id: string,
  payload: UpdateMusclePayload,
): Promise<ApiResult<MuscleRecord>> {
  const result = await toApiResult(
    MusclesService.musclesMuscleIdPatch({
      muscleId: id,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMuscle(result.data),
  };
}

export async function deleteMuscle(id: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    MusclesService.musclesMuscleIdDelete({
      muscleId: id,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: undefined,
  };
}

export async function getMuscle(id: string): Promise<ApiResult<MuscleRecord>> {
  const result = await toApiResult(
    MusclesService.musclesMuscleIdGet({
      muscleId: id,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMuscle(result.data),
  };
}
