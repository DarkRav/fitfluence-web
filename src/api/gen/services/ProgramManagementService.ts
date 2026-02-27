/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExerciseTemplateRequest } from "../models/CreateExerciseTemplateRequest";
import type { CreateProgramRequest } from "../models/CreateProgramRequest";
import type { CreateProgramVersionRequest } from "../models/CreateProgramVersionRequest";
import type { CreateWorkoutTemplateRequest } from "../models/CreateWorkoutTemplateRequest";
import type { ExerciseReorderItem } from "../models/ExerciseReorderItem";
import type { ExerciseTemplate } from "../models/ExerciseTemplate";
import type { PagedProgramResponse } from "../models/PagedProgramResponse";
import type { ProgramDetails } from "../models/ProgramDetails";
import type { ProgramsSearchRequest } from "../models/ProgramsSearchRequest";
import type { ProgramVersion } from "../models/ProgramVersion";
import type { PublishProgramVersionRequest } from "../models/PublishProgramVersionRequest";
import type { UpdateExerciseTemplateRequest } from "../models/UpdateExerciseTemplateRequest";
import type { UpdateProgramRequest } from "../models/UpdateProgramRequest";
import type { UpdateProgramVersionRequest } from "../models/UpdateProgramVersionRequest";
import type { UpdateWorkoutTemplateRequest } from "../models/UpdateWorkoutTemplateRequest";
import type { WorkoutReorderItem } from "../models/WorkoutReorderItem";
import type { WorkoutTemplate } from "../models/WorkoutTemplate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ProgramManagementService {
  /**
   * Создание программы
   * @returns ProgramDetails Программа создана
   * @throws ApiError
   */
  public static adminProgramsPost({
    requestBody,
  }: {
    requestBody: CreateProgramRequest;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/programs",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить программу для редактирования
   * @returns ProgramDetails Детали программы
   * @throws ApiError
   */
  public static adminProgramsProgramIdGet({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/programs/{programId}",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Редактирование программы
   * @returns ProgramDetails Программа обновлена
   * @throws ApiError
   */
  public static adminProgramsProgramIdPatch({
    programId,
    requestBody,
  }: {
    programId: string;
    requestBody: UpdateProgramRequest;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/programs/{programId}",
      path: {
        programId: programId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Список версий программы
   * @returns ProgramVersion Список версий
   * @throws ApiError
   */
  public static adminProgramsProgramIdVersionsGet({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<Array<ProgramVersion>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/programs/{programId}/versions",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создание версии программы
   * @returns ProgramVersion Версия программы создана
   * @throws ApiError
   */
  public static adminProgramsProgramIdVersionsPost({
    programId,
    requestBody,
  }: {
    programId: string;
    requestBody: CreateProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/programs/{programId}/versions",
      path: {
        programId: programId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Получить версию программы
   * @returns ProgramVersion Версия программы
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdGet({
    programVersionId,
  }: {
    programVersionId: string;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/program-versions/{programVersionId}",
      path: {
        programVersionId: programVersionId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Редактирование версии программы
   * @returns ProgramVersion Версия программы обновлена
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdPatch({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody: UpdateProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/program-versions/{programVersionId}",
      path: {
        programVersionId: programVersionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Публикация версии программы
   * @returns ProgramVersion Версия опубликована
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdPublishPost({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody?: PublishProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/program-versions/{programVersionId}/publish",
      path: {
        programVersionId: programVersionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Настройка тренировок - создание workout template
   * @returns WorkoutTemplate Тренировка создана
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdWorkoutsPost({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody: CreateWorkoutTemplateRequest;
  }): CancelablePromise<WorkoutTemplate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/program-versions/{programVersionId}/workouts",
      path: {
        programVersionId: programVersionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Список тренировок версии программы
   * @returns WorkoutTemplate Список тренировок
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdWorkoutsGet({
    programVersionId,
  }: {
    programVersionId: string;
  }): CancelablePromise<Array<WorkoutTemplate>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/program-versions/{programVersionId}/workouts",
      path: {
        programVersionId: programVersionId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Настройка тренировок - редактирование workout template
   * @returns WorkoutTemplate Тренировка обновлена
   * @throws ApiError
   */
  public static adminWorkoutsWorkoutTemplateIdPatch({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: UpdateWorkoutTemplateRequest;
  }): CancelablePromise<WorkoutTemplate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/workouts/{workoutTemplateId}",
      path: {
        workoutTemplateId: workoutTemplateId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить тренировку
   * @returns void
   * @throws ApiError
   */
  public static adminWorkoutsWorkoutTemplateIdDelete({
    workoutTemplateId,
  }: {
    workoutTemplateId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/workouts/{workoutTemplateId}",
      path: {
        workoutTemplateId: workoutTemplateId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Настройка тренировок - добавление упражнения в тренировку
   * @returns ExerciseTemplate Exercise template создан
   * @throws ApiError
   */
  public static adminWorkoutsWorkoutTemplateIdExercisesPost({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: CreateExerciseTemplateRequest;
  }): CancelablePromise<ExerciseTemplate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/workouts/{workoutTemplateId}/exercises",
      path: {
        workoutTemplateId: workoutTemplateId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Настройка тренировок - редактирование упражнения в тренировке
   * @returns ExerciseTemplate Exercise template обновлен
   * @throws ApiError
   */
  public static adminExerciseTemplatesExerciseTemplateIdPatch({
    exerciseTemplateId,
    requestBody,
  }: {
    exerciseTemplateId: string;
    requestBody: UpdateExerciseTemplateRequest;
  }): CancelablePromise<ExerciseTemplate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/exercise-templates/{exerciseTemplateId}",
      path: {
        exerciseTemplateId: exerciseTemplateId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить упражнение из тренировки
   * @returns void
   * @throws ApiError
   */
  public static adminExerciseTemplatesExerciseTemplateIdDelete({
    exerciseTemplateId,
  }: {
    exerciseTemplateId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/exercise-templates/{exerciseTemplateId}",
      path: {
        exerciseTemplateId: exerciseTemplateId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Поиск программ
   * @returns PagedProgramResponse Результаты поиска
   * @throws ApiError
   */
  public static adminProgramsSearchPost({
    requestBody,
  }: {
    requestBody: ProgramsSearchRequest;
  }): CancelablePromise<PagedProgramResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/programs/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Изменить порядок тренировок в версии программы
   * @returns void
   * @throws ApiError
   */
  public static adminProgramVersionsProgramVersionIdWorkoutsReorderPatch({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody: Array<WorkoutReorderItem>;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/program-versions/{programVersionId}/workouts:reorder",
      path: {
        programVersionId: programVersionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Изменить порядок упражнений в тренировке
   * @returns void
   * @throws ApiError
   */
  public static adminWorkoutsWorkoutTemplateIdExercisesReorderPatch({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: Array<ExerciseReorderItem>;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/workouts/{workoutTemplateId}/exercises:reorder",
      path: {
        workoutTemplateId: workoutTemplateId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
}
