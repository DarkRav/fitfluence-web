import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  InfluencerCabinetService,
  type CreateExerciseTemplateRequest,
  type CreateWorkoutTemplateRequest,
  type ExerciseReorderItem,
  type ExerciseTemplate,
  type UpdateExerciseTemplateRequest,
  type UpdateWorkoutTemplateRequest,
  type WorkoutTemplate,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type InfluencerWorkoutExerciseRecord = {
  id: string;
  exerciseId: string;
  exerciseCode: string;
  exerciseName: string;
  progressionPolicyId?: string;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
  orderIndex: number;
};

export type InfluencerWorkoutTemplateRecord = {
  id: string;
  dayOrder: number;
  title?: string;
  coachNote?: string;
  exercises: InfluencerWorkoutExerciseRecord[];
};

export type InfluencerWorkoutsPageResult = {
  items: InfluencerWorkoutTemplateRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type InfluencerWorkoutsSearchParams = {
  programVersionId: string;
  page: number;
  size: number;
  search?: string;
};

export type CreateInfluencerWorkoutTemplatePayload = CreateWorkoutTemplateRequest;
export type UpdateInfluencerWorkoutTemplatePayload = UpdateWorkoutTemplateRequest;

export type AddInfluencerWorkoutExercisePayload = CreateExerciseTemplateRequest;
export type UpdateInfluencerWorkoutExercisePayload = UpdateExerciseTemplateRequest;
export type ReorderInfluencerWorkoutExercisesPayload = ExerciseReorderItem[];

function mapExercise(item: ExerciseTemplate): InfluencerWorkoutExerciseRecord {
  return {
    id: item.id,
    exerciseId: item.exercise.id,
    exerciseCode: item.exercise.code,
    exerciseName: item.exercise.name,
    progressionPolicyId: (item as { progressionPolicyId?: string }).progressionPolicyId,
    sets: item.sets,
    repsMin: item.repsMin,
    repsMax: item.repsMax,
    targetRpe: item.targetRpe,
    restSeconds: item.restSeconds,
    notes: item.notes,
    orderIndex: item.orderIndex ?? 0,
  };
}

function mapWorkout(item: WorkoutTemplate): InfluencerWorkoutTemplateRecord {
  return {
    id: item.id,
    dayOrder: item.dayOrder,
    title: item.title,
    coachNote: item.coachNote,
    exercises: (item.exercises ?? [])
      .map(mapExercise)
      .sort((left, right) => left.orderIndex - right.orderIndex),
  };
}

function normalizeCreateWorkoutPayload(
  payload: CreateInfluencerWorkoutTemplatePayload,
): CreateWorkoutTemplateRequest {
  return {
    dayOrder: payload.dayOrder,
    title: payload.title?.trim() || undefined,
    coachNote: payload.coachNote?.trim() || undefined,
  };
}

function normalizeUpdateWorkoutPayload(
  payload: UpdateInfluencerWorkoutTemplatePayload,
): UpdateWorkoutTemplateRequest {
  return {
    dayOrder: payload.dayOrder,
    title: payload.title?.trim() || undefined,
    coachNote: payload.coachNote?.trim() || undefined,
  };
}

function normalizeAddExercisePayload(
  payload: AddInfluencerWorkoutExercisePayload,
): CreateExerciseTemplateRequest {
  return {
    exerciseId: payload.exerciseId,
    sets: payload.sets,
    repsMin: payload.repsMin,
    repsMax: payload.repsMax,
    targetRpe: payload.targetRpe,
    restSeconds: payload.restSeconds,
    notes: payload.notes?.trim() || undefined,
    progressionPolicyId: payload.progressionPolicyId,
  };
}

function normalizeUpdateExercisePayload(
  payload: UpdateInfluencerWorkoutExercisePayload,
): UpdateExerciseTemplateRequest {
  return {
    sets: payload.sets,
    repsMin: payload.repsMin,
    repsMax: payload.repsMax,
    targetRpe: payload.targetRpe,
    restSeconds: payload.restSeconds,
    notes: payload.notes?.trim() || undefined,
    progressionPolicyId: payload.progressionPolicyId,
  };
}

function normalizeReorderPayload(
  payload: ReorderInfluencerWorkoutExercisesPayload,
): ExerciseReorderItem[] {
  return payload.map((item) => ({
    exerciseTemplateId: item.exerciseTemplateId,
    orderIndex: item.orderIndex,
  }));
}

function applyLocalFilters(
  workouts: InfluencerWorkoutTemplateRecord[],
  params: InfluencerWorkoutsSearchParams,
): InfluencerWorkoutTemplateRecord[] {
  const query = params.search?.trim().toLowerCase();
  if (!query) {
    return workouts;
  }

  return workouts.filter((item) => {
    const haystack = `${item.title ?? ""} ${item.coachNote ?? ""} ${item.dayOrder}`.toLowerCase();
    return haystack.includes(query);
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

export async function searchInfluencerWorkoutTemplates(
  params: InfluencerWorkoutsSearchParams,
): Promise<ApiResult<InfluencerWorkoutsPageResult>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramVersionsProgramVersionIdWorkoutsGet({
      programVersionId: params.programVersionId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  const allItems = (result.data ?? [])
    .map(mapWorkout)
    .sort((left, right) => left.dayOrder - right.dayOrder);
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

export async function getInfluencerWorkoutTemplate(
  programVersionId: string,
  workoutTemplateId: string,
): Promise<ApiResult<InfluencerWorkoutTemplateRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramVersionsProgramVersionIdWorkoutsGet({
      programVersionId,
    }),
  );

  if (!result.ok) {
    return result;
  }

  const target = (result.data ?? []).find((item) => item.id === workoutTemplateId);
  if (!target) {
    return {
      ok: false,
      error: {
        kind: "not_found",
        message: "Workout template not found",
      },
    };
  }

  return {
    ok: true,
    data: mapWorkout(target),
  };
}

export async function createInfluencerWorkoutTemplate(
  programVersionId: string,
  payload: CreateInfluencerWorkoutTemplatePayload,
): Promise<ApiResult<InfluencerWorkoutTemplateRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerProgramVersionsProgramVersionIdWorkoutsPost({
      programVersionId,
      requestBody: normalizeCreateWorkoutPayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapWorkout(result.data),
  };
}

export async function updateInfluencerWorkoutTemplate(
  workoutTemplateId: string,
  payload: UpdateInfluencerWorkoutTemplatePayload,
): Promise<ApiResult<InfluencerWorkoutTemplateRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerWorkoutsWorkoutTemplateIdPatch({
      workoutTemplateId,
      requestBody: normalizeUpdateWorkoutPayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapWorkout(result.data),
  };
}

export async function deleteInfluencerWorkoutTemplate(
  workoutTemplateId: string,
): Promise<ApiResult<void>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerWorkoutsWorkoutTemplateIdDelete({
      workoutTemplateId,
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

export async function addInfluencerWorkoutExercise(
  workoutTemplateId: string,
  payload: AddInfluencerWorkoutExercisePayload,
): Promise<ApiResult<InfluencerWorkoutExerciseRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerWorkoutsWorkoutTemplateIdExercisesPost({
      workoutTemplateId,
      requestBody: normalizeAddExercisePayload(payload),
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

export async function updateInfluencerWorkoutExercise(
  exerciseTemplateId: string,
  payload: UpdateInfluencerWorkoutExercisePayload,
): Promise<ApiResult<InfluencerWorkoutExerciseRecord>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExerciseTemplatesExerciseTemplateIdPatch({
      exerciseTemplateId,
      requestBody: normalizeUpdateExercisePayload(payload),
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

export async function deleteInfluencerWorkoutExercise(
  exerciseTemplateId: string,
): Promise<ApiResult<void>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerExerciseTemplatesExerciseTemplateIdDelete({
      exerciseTemplateId,
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

export async function reorderInfluencerWorkoutExercises(
  workoutTemplateId: string,
  payload: ReorderInfluencerWorkoutExercisesPayload,
): Promise<ApiResult<void>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerWorkoutsWorkoutTemplateIdExercisesReorderPatch({
      workoutTemplateId,
      requestBody: normalizeReorderPayload(payload),
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
