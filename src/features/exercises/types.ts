import type { ApiResult } from "@/api/httpClient";
import type {
  AdminExercisesFilters,
  ExerciseDifficultyLevel,
  ExerciseMovementPattern,
} from "@/api/adminExercises";
import type { ReferenceOption } from "@/api/referenceData";

export type ExerciseCrudScope = "admin" | "influencer";

export type ExerciseCrudItem = {
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

export type ExerciseCrudPageResult = {
  items: ExerciseCrudItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ExerciseCrudSearchParams = {
  page: number;
  size: number;
  search?: string;
  filters?: AdminExercisesFilters;
};

export type CreateExerciseCrudPayload = {
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

export type UpdateExerciseCrudPayload = Omit<CreateExerciseCrudPayload, "code">;

export type ExercisesCrudApi = {
  search: (params: ExerciseCrudSearchParams) => Promise<ApiResult<ExerciseCrudPageResult>>;
  create: (payload: CreateExerciseCrudPayload) => Promise<ApiResult<ExerciseCrudItem>>;
  update: (id: string, payload: UpdateExerciseCrudPayload) => Promise<ApiResult<ExerciseCrudItem>>;
  remove: (id: string) => Promise<ApiResult<void>>;
};

export type ExerciseReferenceLoaders = {
  loadMuscles: (search?: string) => Promise<ApiResult<ReferenceOption[]>>;
  loadEquipment: (search?: string) => Promise<ApiResult<ReferenceOption[]>>;
};

export type ExercisesCrudScopeConfig = {
  scope: ExerciseCrudScope;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  queryKeyPrefix: readonly [string, ExerciseCrudScope];
  api: ExercisesCrudApi;
  references: ExerciseReferenceLoaders;
  messages: {
    created: string;
    updated: string;
    deleted: string;
  };
  deleteDialog: {
    title: string;
    description: (item: ExerciseCrudItem) => string;
  };
};
