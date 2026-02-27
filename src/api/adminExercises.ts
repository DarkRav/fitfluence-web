import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ExercisesService,
  type CreateExerciseRequest,
  type DifficultyLevel,
  type Exercise,
  type MuscleGroup,
  type MovementPattern,
  type UpdateExerciseRequest,
} from "@/api/gen";

configureOpenApiClient();

export type ExerciseDifficultyLevel = DifficultyLevel;
export type ExerciseMovementPattern = MovementPattern;

export type AdminExerciseRecord = {
  id: string;
  code: string;
  name: string;
  description?: string;
  movementPattern?: ExerciseMovementPattern;
  difficultyLevel?: ExerciseDifficultyLevel;
  isBodyweight: boolean;
  muscleIds: string[];
  equipmentIds: string[];
  mediaIds: string[];
  musclesLabel: string;
  equipmentLabel: string;
  createdByInfluencerId?: string;
};

export type AdminExercisesPageResult = {
  items: AdminExerciseRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminExercisesFilters = {
  movementPattern?: ExerciseMovementPattern;
  difficultyLevel?: ExerciseDifficultyLevel;
  muscleGroups?: MuscleGroup[];
  muscleIds?: string[];
  equipmentIds?: string[];
};

export type AdminExercisesSearchParams = {
  page: number;
  size: number;
  search?: string;
  filters?: AdminExercisesFilters;
};

const DEFAULT_PAGE_SIZE = 20;

export type CreateAdminExercisePayload = {
  code: string;
  name: string;
  description?: string;
  movementPattern?: ExerciseMovementPattern;
  difficultyLevel?: ExerciseDifficultyLevel;
  isBodyweight?: boolean;
  muscleIds?: string[];
  equipmentIds?: string[];
  mediaIds?: string[];
};

export type UpdateAdminExercisePayload = {
  name?: string;
  description?: string;
  movementPattern?: ExerciseMovementPattern;
  difficultyLevel?: ExerciseDifficultyLevel;
  isBodyweight?: boolean;
  muscleIds?: string[];
  equipmentIds?: string[];
  mediaIds?: string[];
};

function mapExercise(item: Exercise): AdminExerciseRecord {
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

function normalizeCreatePayload(payload: CreateAdminExercisePayload): CreateExerciseRequest {
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

function normalizeUpdatePayload(payload: UpdateAdminExercisePayload): UpdateExerciseRequest {
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

export async function searchAdminExercises(
  params: AdminExercisesSearchParams,
): Promise<ApiResult<AdminExercisesPageResult>> {
  const result = await toApiResult(
    ExercisesService.exercisesSearch({
      requestBody: {
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
      },
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

export async function createAdminExercise(
  payload: CreateAdminExercisePayload,
): Promise<ApiResult<AdminExerciseRecord>> {
  const result = await toApiResult(
    ExercisesService.exercisesPost({
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

export async function updateAdminExercise(
  id: string,
  payload: UpdateAdminExercisePayload,
): Promise<ApiResult<AdminExerciseRecord>> {
  const result = await toApiResult(
    ExercisesService.exercisesExerciseIdPatch({
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

export async function deleteAdminExercise(id: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    ExercisesService.exercisesExerciseIdDelete({
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

export async function getAdminExerciseById(id: string): Promise<ApiResult<AdminExerciseRecord>> {
  const result = await toApiResult(
    ExercisesService.exercisesExerciseIdGet({
      exerciseId: id,
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

export const exerciseMovementPatternOptions: Array<{
  value: ExerciseMovementPattern;
  label: string;
}> = [
  { value: "PUSH", label: "Жим" },
  { value: "PULL", label: "Тяга" },
  { value: "SQUAT", label: "Приседание" },
  { value: "HINGE", label: "Наклон/тяжёлая тяга" },
  { value: "OTHER", label: "Другое" },
];

export const exerciseDifficultyOptions: Array<{
  value: ExerciseDifficultyLevel;
  label: string;
}> = [
  { value: "BEGINNER", label: "Начальный" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
];
