import type { ApiResult } from "@/api/httpClient";

export type WorkoutExerciseRecord = {
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

export type WorkoutTemplateRecord = {
  id: string;
  dayOrder: number;
  title?: string;
  coachNote?: string;
  exercises: WorkoutExerciseRecord[];
};

export type WorkoutsPageResult = {
  items: WorkoutTemplateRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type WorkoutExerciseSearchRecord = {
  id: string;
  code: string;
  name: string;
  createdByInfluencerId?: string;
};

export type WorkoutsSearchParams = {
  programVersionId: string;
  page: number;
  size: number;
  search?: string;
};

export type CreateWorkoutPayload = {
  dayOrder: number;
  title?: string;
  coachNote?: string;
};

export type UpdateWorkoutPayload = {
  dayOrder?: number;
  title?: string;
  coachNote?: string;
};

export type AddWorkoutExercisePayload = {
  exerciseId: string;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
  progressionPolicyId?: string;
};

export type UpdateWorkoutExercisePayload = {
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
  progressionPolicyId?: string;
};

export type ReorderWorkoutExercisesPayload = Array<{
  exerciseTemplateId: string;
  orderIndex: number;
}>;

export type WorkoutsScope = "admin" | "influencer";

export type WorkoutsScopeConfig = {
  scope: WorkoutsScope;
  queryKeys: {
    list: readonly [string, WorkoutsScope];
    details: readonly [string, WorkoutsScope];
    addExercise: readonly [string, WorkoutsScope];
  };
  routes: {
    programDetails: (programId: string) => string;
    workoutsList: (programId: string, programVersionId: string) => string;
    workoutDetails: (
      programId: string,
      programVersionId: string,
      workoutTemplateId: string,
    ) => string;
  };
  api: {
    listWorkouts: (params: WorkoutsSearchParams) => Promise<ApiResult<WorkoutsPageResult>>;
    getWorkout: (
      programVersionId: string,
      workoutTemplateId: string,
    ) => Promise<ApiResult<WorkoutTemplateRecord>>;
    createWorkout: (
      programVersionId: string,
      payload: CreateWorkoutPayload,
    ) => Promise<ApiResult<WorkoutTemplateRecord>>;
    updateWorkout: (
      workoutTemplateId: string,
      payload: UpdateWorkoutPayload,
    ) => Promise<ApiResult<WorkoutTemplateRecord>>;
    deleteWorkout: (workoutTemplateId: string) => Promise<ApiResult<void>>;
    searchExercises: (params: { page: number; size: number; search?: string }) => Promise<
      ApiResult<{
        items: WorkoutExerciseSearchRecord[];
      }>
    >;
    searchProgressionPolicies: (params: { page: number; size: number; search?: string }) => Promise<
      ApiResult<{
        items: Array<{
          id: string;
          name: string;
        }>;
      }>
    >;
    addExercise: (
      workoutTemplateId: string,
      payload: AddWorkoutExercisePayload,
    ) => Promise<ApiResult<WorkoutExerciseRecord>>;
    updateExercise: (
      exerciseTemplateId: string,
      payload: UpdateWorkoutExercisePayload,
    ) => Promise<ApiResult<WorkoutExerciseRecord>>;
    deleteExercise: (exerciseTemplateId: string) => Promise<ApiResult<void>>;
    reorderExercises: (
      workoutTemplateId: string,
      payload: ReorderWorkoutExercisesPayload,
    ) => Promise<ApiResult<void>>;
  };
};
