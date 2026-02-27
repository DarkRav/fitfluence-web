import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProgramManagementService,
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

export type AdminWorkoutExerciseRecord = {
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

export type AdminWorkoutTemplateRecord = {
  id: string;
  dayOrder: number;
  title?: string;
  coachNote?: string;
  exercises: AdminWorkoutExerciseRecord[];
};

export type AdminWorkoutsPageResult = {
  items: AdminWorkoutTemplateRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminWorkoutsSearchParams = {
  programVersionId: string;
  page: number;
  size: number;
  search?: string;
};

export type CreateAdminWorkoutTemplatePayload = CreateWorkoutTemplateRequest;
export type UpdateAdminWorkoutTemplatePayload = UpdateWorkoutTemplateRequest;

export type AddAdminWorkoutExercisePayload = CreateExerciseTemplateRequest;
export type UpdateAdminWorkoutExercisePayload = UpdateExerciseTemplateRequest;
export type ReorderAdminWorkoutExercisesPayload = ExerciseReorderItem[];

function mapExercise(item: ExerciseTemplate): AdminWorkoutExerciseRecord {
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

function mapWorkout(item: WorkoutTemplate): AdminWorkoutTemplateRecord {
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
  payload: CreateAdminWorkoutTemplatePayload,
): CreateWorkoutTemplateRequest {
  return {
    dayOrder: payload.dayOrder,
    title: payload.title?.trim() || undefined,
    coachNote: payload.coachNote?.trim() || undefined,
  };
}

function normalizeUpdateWorkoutPayload(
  payload: UpdateAdminWorkoutTemplatePayload,
): UpdateWorkoutTemplateRequest {
  return {
    dayOrder: payload.dayOrder,
    title: payload.title?.trim() || undefined,
    coachNote: payload.coachNote?.trim() || undefined,
  };
}

function normalizeAddExercisePayload(
  payload: AddAdminWorkoutExercisePayload,
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
  payload: UpdateAdminWorkoutExercisePayload,
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
  payload: ReorderAdminWorkoutExercisesPayload,
): ExerciseReorderItem[] {
  return payload.map((item) => ({
    exerciseTemplateId: item.exerciseTemplateId,
    orderIndex: item.orderIndex,
  }));
}

function applyLocalFilters(
  workouts: AdminWorkoutTemplateRecord[],
  params: AdminWorkoutsSearchParams,
): AdminWorkoutTemplateRecord[] {
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

export async function listAdminWorkouts(
  params: AdminWorkoutsSearchParams,
): Promise<ApiResult<AdminWorkoutsPageResult>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdWorkoutsGet({
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

export async function getAdminWorkout(
  programVersionId: string,
  workoutTemplateId: string,
): Promise<ApiResult<AdminWorkoutTemplateRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdWorkoutsGet({
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

export async function createAdminWorkout(
  programVersionId: string,
  payload: CreateAdminWorkoutTemplatePayload,
): Promise<ApiResult<AdminWorkoutTemplateRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminProgramVersionsProgramVersionIdWorkoutsPost({
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

export async function updateAdminWorkout(
  workoutTemplateId: string,
  payload: UpdateAdminWorkoutTemplatePayload,
): Promise<ApiResult<AdminWorkoutTemplateRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminWorkoutsWorkoutTemplateIdPatch({
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

export async function deleteAdminWorkout(workoutTemplateId: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    ProgramManagementService.adminWorkoutsWorkoutTemplateIdDelete({
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

export async function addExerciseToAdminWorkout(
  workoutTemplateId: string,
  payload: AddAdminWorkoutExercisePayload,
): Promise<ApiResult<AdminWorkoutExerciseRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminWorkoutsWorkoutTemplateIdExercisesPost({
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

export async function updateAdminWorkoutExercise(
  exerciseTemplateId: string,
  payload: UpdateAdminWorkoutExercisePayload,
): Promise<ApiResult<AdminWorkoutExerciseRecord>> {
  const result = await toApiResult(
    ProgramManagementService.adminExerciseTemplatesExerciseTemplateIdPatch({
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

export async function deleteAdminWorkoutExercise(
  exerciseTemplateId: string,
): Promise<ApiResult<void>> {
  const result = await toApiResult(
    ProgramManagementService.adminExerciseTemplatesExerciseTemplateIdDelete({
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

export async function reorderAdminWorkoutExercises(
  workoutTemplateId: string,
  payload: ReorderAdminWorkoutExercisesPayload,
): Promise<ApiResult<void>> {
  const result = await toApiResult(
    ProgramManagementService.adminWorkoutsWorkoutTemplateIdExercisesReorderPatch({
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
