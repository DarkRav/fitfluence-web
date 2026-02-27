import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  InfluencerCabinetService,
  type CreateExerciseRequest,
  type DifficultyLevel,
  type Exercise,
  type ExercisesSearchRequest,
  type MuscleGroup,
  type MovementPattern,
  type UpdateExerciseRequest,
} from "@/api/gen";

configureOpenApiClient();

export type InfluencerExerciseDifficultyLevel = DifficultyLevel;
export type InfluencerExerciseMovementPattern = MovementPattern;

export type InfluencerExerciseRecord = {
  id: string;
  code: string;
  name: string;
  description?: string;
  movementPattern?: InfluencerExerciseMovementPattern;
  difficultyLevel?: InfluencerExerciseDifficultyLevel;
  isBodyweight: boolean;
  muscleIds: string[];
  equipmentIds: string[];
  mediaIds: string[];
  musclesLabel: string;
  equipmentLabel: string;
  createdByInfluencerId?: string;
};

export type InfluencerExercisesPageResult = {
  items: InfluencerExerciseRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type InfluencerExercisesFilters = {
  movementPattern?: InfluencerExerciseMovementPattern;
  difficultyLevel?: InfluencerExerciseDifficultyLevel;
  muscleGroups?: MuscleGroup[];
  muscleIds?: string[];
  equipmentIds?: string[];
};

export type InfluencerExercisesSearchParams = {
  page: number;
  size: number;
  search?: string;
  filters?: InfluencerExercisesFilters;
};

const DEFAULT_PAGE_SIZE = 20;

export type CreateInfluencerExercisePayload = {
  code: string;
  name: string;
  description?: string;
  movementPattern?: InfluencerExerciseMovementPattern;
  difficultyLevel?: InfluencerExerciseDifficultyLevel;
  isBodyweight?: boolean;
  muscleIds?: string[];
  equipmentIds?: string[];
  mediaIds?: string[];
};

export type UpdateInfluencerExercisePayload = {
  name?: string;
  description?: string;
  movementPattern?: InfluencerExerciseMovementPattern;
  difficultyLevel?: InfluencerExerciseDifficultyLevel;
  isBodyweight?: boolean;
  muscleIds?: string[];
  equipmentIds?: string[];
  mediaIds?: string[];
};

function mapExercise(item: Exercise): InfluencerExerciseRecord {
  const muscles = item.muscles ?? [];
  const equipment = item.equipment ?? [];

  return {
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description,
    movementPattern: item.movementPattern,
    difficultyLevel: item.difficultyLevel,
    isBodyweight: item.isBodyweight ?? false,
    muscleIds: muscles.map((muscle) => muscle.id),
    equipmentIds: equipment.map((eq) => eq.id),
    mediaIds: (item.media ?? []).map((media) => media.id),
    musclesLabel: muscles.map((muscle) => muscle.name).join(", "),
    equipmentLabel: equipment.map((eq) => eq.name).join(", "),
    createdByInfluencerId: item.createdByInfluencerId,
  };
}

function normalizeCreatePayload(payload: CreateInfluencerExercisePayload): CreateExerciseRequest {
  return {
    code: payload.code.trim(),
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    movementPattern: payload.movementPattern,
    difficultyLevel: payload.difficultyLevel,
    isBodyweight: payload.isBodyweight ?? false,
    muscleIds: payload.muscleIds ?? [],
    equipmentIds: payload.equipmentIds ?? [],
    mediaIds: payload.mediaIds ?? [],
  };
}

function normalizeUpdatePayload(payload: UpdateInfluencerExercisePayload): UpdateExerciseRequest {
  return {
    name: payload.name?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    movementPattern: payload.movementPattern,
    difficultyLevel: payload.difficultyLevel,
    isBodyweight: payload.isBodyweight,
    muscleIds: payload.muscleIds,
    equipmentIds: payload.equipmentIds,
    mediaIds: payload.mediaIds,
  };
}

function buildSearchRequest(params: InfluencerExercisesSearchParams): ExercisesSearchRequest {
  return {
    filter: {
      search: params.search?.trim() || undefined,
      movementPattern: params.filters?.movementPattern,
      difficultyLevel: params.filters?.difficultyLevel,
      muscleGroups: params.filters?.muscleGroups,
      muscleIds: params.filters?.muscleIds,
      equipmentIds: params.filters?.equipmentIds,
    },
    page: params.page,
    size: params.size || DEFAULT_PAGE_SIZE,
  };
}

export async function searchInfluencerExercises(
  params: InfluencerExercisesSearchParams,
): Promise<ApiResult<InfluencerExercisesPageResult>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExercisesSearchPost({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: {
      items: (result.data.content ?? []).map(mapExercise),
      page: result.data.metadata.page,
      size: result.data.metadata.size,
      totalElements: result.data.metadata.totalElements,
      totalPages: result.data.metadata.totalPages,
    },
  };
}

export async function createInfluencerExercise(
  payload: CreateInfluencerExercisePayload,
): Promise<ApiResult<InfluencerExerciseRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExercisesPost({
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapExercise(result.data),
  };
}

export async function updateInfluencerExercise(
  id: string,
  payload: UpdateInfluencerExercisePayload,
): Promise<ApiResult<InfluencerExerciseRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExercisesExerciseIdPatch({
      exerciseId: id,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapExercise(result.data),
  };
}

export async function deleteInfluencerExercise(id: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExercisesExerciseIdDelete({
      exerciseId: id,
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
