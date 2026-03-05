/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExerciseRequest } from "../models/CreateExerciseRequest";
import type { CreateExerciseTemplateRequest } from "../models/CreateExerciseTemplateRequest";
import type { CreateInfluencerProgramRequest } from "../models/CreateInfluencerProgramRequest";
import type { CreateProgramVersionRequest } from "../models/CreateProgramVersionRequest";
import type { CreateWorkoutTemplateRequest } from "../models/CreateWorkoutTemplateRequest";
import type { CreatorAnalyticsResponse } from "../models/CreatorAnalyticsResponse";
import type { Exercise } from "../models/Exercise";
import type { ExerciseReorderItem } from "../models/ExerciseReorderItem";
import type { ExercisesSearchRequest } from "../models/ExercisesSearchRequest";
import type { ExerciseTemplate } from "../models/ExerciseTemplate";
import type { InfluencerProgramAnalyticsFunnelResponse } from "../models/InfluencerProgramAnalyticsFunnelResponse";
import type { InfluencerProgramAnalyticsSummaryResponse } from "../models/InfluencerProgramAnalyticsSummaryResponse";
import type { Media } from "../models/Media";
import type { MediaSearchRequest } from "../models/MediaSearchRequest";
import type { PagedExerciseResponse } from "../models/PagedExerciseResponse";
import type { PagedMediaResponse } from "../models/PagedMediaResponse";
import type { PagedProgramResponse } from "../models/PagedProgramResponse";
import type { ProgramDetails } from "../models/ProgramDetails";
import type { ProgramsSearchRequest } from "../models/ProgramsSearchRequest";
import type { ProgramVersion } from "../models/ProgramVersion";
import type { PublishProgramVersionRequest } from "../models/PublishProgramVersionRequest";
import type { UpdateExerciseRequest } from "../models/UpdateExerciseRequest";
import type { UpdateExerciseTemplateRequest } from "../models/UpdateExerciseTemplateRequest";
import type { UpdateMediaRequest } from "../models/UpdateMediaRequest";
import type { UpdateProgramRequest } from "../models/UpdateProgramRequest";
import type { UpdateProgramVersionRequest } from "../models/UpdateProgramVersionRequest";
import type { UpdateWorkoutTemplateRequest } from "../models/UpdateWorkoutTemplateRequest";
import type { WorkoutTemplate } from "../models/WorkoutTemplate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class InfluencerCabinetService {
  /**
   * Создать программу от имени инфлюэнсера
   * @returns ProgramDetails Программа создана
   * @throws ApiError
   */
  public static influencerProgramsPost({
    requestBody,
  }: {
    requestBody: CreateInfluencerProgramRequest;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/programs",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Поиск программ инфлюэнсера
   * @returns PagedProgramResponse Результаты поиска
   * @throws ApiError
   */
  public static influencerProgramsSearchPost({
    requestBody,
  }: {
    requestBody: ProgramsSearchRequest;
  }): CancelablePromise<PagedProgramResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/programs/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Получить программу инфлюэнсера
   * @returns ProgramDetails Детали программы
   * @throws ApiError
   */
  public static influencerProgramsProgramIdGet({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/programs/{programId}",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить программу инфлюэнсера
   * @returns ProgramDetails Программа обновлена
   * @throws ApiError
   */
  public static influencerProgramsProgramIdPatch({
    programId,
    requestBody,
  }: {
    programId: string;
    requestBody: UpdateProgramRequest;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/programs/{programId}",
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
   * Архивировать программу инфлюэнсера
   * @returns void
   * @throws ApiError
   */
  public static influencerProgramsProgramIdDelete({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/influencer/programs/{programId}",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Сводная аналитика creator для экрана профиля
   * @returns CreatorAnalyticsResponse Сводные метрики creator
   * @throws ApiError
   */
  public static creatorAnalyticsGet(): CancelablePromise<CreatorAnalyticsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/creator/analytics",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Совместимый alias analytics для influencer
   * @returns CreatorAnalyticsResponse Сводные метрики influencer
   * @throws ApiError
   */
  public static influencerAnalyticsGet(): CancelablePromise<CreatorAnalyticsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/analytics",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Сводная аналитика программы инфлюэнсера за период
   * @returns InfluencerProgramAnalyticsSummaryResponse Summary-метрики creator analytics
   * @throws ApiError
   */
  public static influencerProgramsProgramIdAnalyticsSummaryGet({
    programId,
    dateFrom,
    dateTo,
  }: {
    programId: string;
    dateFrom?: string;
    dateTo?: string;
  }): CancelablePromise<InfluencerProgramAnalyticsSummaryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/programs/{programId}/analytics/summary",
      path: {
        programId: programId,
      },
      query: {
        dateFrom: dateFrom,
        dateTo: dateTo,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Воронка прохождения программы инфлюэнсера
   * @returns InfluencerProgramAnalyticsFunnelResponse Шаги воронки program_view -> program_start -> first_workout_start -> first_workout_complete -> completion
   * @throws ApiError
   */
  public static influencerProgramsProgramIdAnalyticsFunnelGet({
    programId,
    dateFrom,
    dateTo,
  }: {
    programId: string;
    dateFrom?: string;
    dateTo?: string;
  }): CancelablePromise<InfluencerProgramAnalyticsFunnelResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/programs/{programId}/analytics/funnel",
      path: {
        programId: programId,
      },
      query: {
        dateFrom: dateFrom,
        dateTo: dateTo,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Получить список версий программы инфлюэнсера
   * @returns ProgramVersion Список версий
   * @throws ApiError
   */
  public static influencerProgramsProgramIdVersionsGet({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<Array<ProgramVersion>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/programs/{programId}/versions",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создать версию программы инфлюэнсера
   * @returns ProgramVersion Версия создана
   * @throws ApiError
   */
  public static influencerProgramsProgramIdVersionsPost({
    programId,
    requestBody,
  }: {
    programId: string;
    requestBody: CreateProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/programs/{programId}/versions",
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
   * Получить версию программы инфлюэнсера
   * @returns ProgramVersion Версия программы
   * @throws ApiError
   */
  public static influencerProgramVersionsProgramVersionIdGet({
    programVersionId,
  }: {
    programVersionId: string;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/program-versions/{programVersionId}",
      path: {
        programVersionId: programVersionId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить версию программы инфлюэнсера
   * @returns ProgramVersion Версия обновлена
   * @throws ApiError
   */
  public static influencerProgramVersionsProgramVersionIdPatch({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody: UpdateProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/program-versions/{programVersionId}",
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
   * Опубликовать версию программы инфлюэнсера
   * @returns ProgramVersion Версия опубликована
   * @throws ApiError
   */
  public static influencerProgramVersionsProgramVersionIdPublishPost({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody?: PublishProgramVersionRequest;
  }): CancelablePromise<ProgramVersion> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/program-versions/{programVersionId}/publish",
      path: {
        programVersionId: programVersionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создать тренировку в версии программы
   * @returns WorkoutTemplate Тренировка создана
   * @throws ApiError
   */
  public static influencerProgramVersionsProgramVersionIdWorkoutsPost({
    programVersionId,
    requestBody,
  }: {
    programVersionId: string;
    requestBody: CreateWorkoutTemplateRequest;
  }): CancelablePromise<WorkoutTemplate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/program-versions/{programVersionId}/workouts",
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
   * Получить список тренировок версии программы
   * @returns WorkoutTemplate Список тренировок
   * @throws ApiError
   */
  public static influencerProgramVersionsProgramVersionIdWorkoutsGet({
    programVersionId,
  }: {
    programVersionId: string;
  }): CancelablePromise<Array<WorkoutTemplate>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/program-versions/{programVersionId}/workouts",
      path: {
        programVersionId: programVersionId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить тренировку
   * @returns WorkoutTemplate Тренировка обновлена
   * @throws ApiError
   */
  public static influencerWorkoutsWorkoutTemplateIdPatch({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: UpdateWorkoutTemplateRequest;
  }): CancelablePromise<WorkoutTemplate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/workouts/{workoutTemplateId}",
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
  public static influencerWorkoutsWorkoutTemplateIdDelete({
    workoutTemplateId,
  }: {
    workoutTemplateId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/influencer/workouts/{workoutTemplateId}",
      path: {
        workoutTemplateId: workoutTemplateId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Добавить упражнение в тренировку
   * @returns ExerciseTemplate Exercise template создан
   * @throws ApiError
   */
  public static influencerWorkoutsWorkoutTemplateIdExercisesPost({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: CreateExerciseTemplateRequest;
  }): CancelablePromise<ExerciseTemplate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/workouts/{workoutTemplateId}/exercises",
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
   * Изменить порядок упражнений в тренировке
   * @returns void
   * @throws ApiError
   */
  public static influencerWorkoutsWorkoutTemplateIdExercisesReorderPatch({
    workoutTemplateId,
    requestBody,
  }: {
    workoutTemplateId: string;
    requestBody: Array<ExerciseReorderItem>;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/workouts/{workoutTemplateId}/exercises:reorder",
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
   * Обновить упражнение в тренировке
   * @returns ExerciseTemplate Exercise template обновлен
   * @throws ApiError
   */
  public static influencerExerciseTemplatesExerciseTemplateIdPatch({
    exerciseTemplateId,
    requestBody,
  }: {
    exerciseTemplateId: string;
    requestBody: UpdateExerciseTemplateRequest;
  }): CancelablePromise<ExerciseTemplate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/exercise-templates/{exerciseTemplateId}",
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
  public static influencerExerciseTemplatesExerciseTemplateIdDelete({
    exerciseTemplateId,
  }: {
    exerciseTemplateId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/influencer/exercise-templates/{exerciseTemplateId}",
      path: {
        exerciseTemplateId: exerciseTemplateId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создать упражнение
   * @returns Exercise Упражнение создано
   * @throws ApiError
   */
  public static influencerExercisesPost({
    requestBody,
  }: {
    requestBody: CreateExerciseRequest;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/exercises",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Поиск упражнений инфлюэнсера
   * @returns PagedExerciseResponse Результаты поиска
   * @throws ApiError
   */
  public static influencerExercisesSearchPost({
    requestBody,
  }: {
    requestBody: ExercisesSearchRequest;
  }): CancelablePromise<PagedExerciseResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/exercises/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Обновить упражнение
   * @returns Exercise Упражнение обновлено
   * @throws ApiError
   */
  public static influencerExercisesExerciseIdPatch({
    exerciseId,
    requestBody,
  }: {
    exerciseId: string;
    requestBody: UpdateExerciseRequest;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
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
   * Удалить упражнение
   * @returns void
   * @throws ApiError
   */
  public static influencerExercisesExerciseIdDelete({
    exerciseId,
  }: {
    exerciseId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/influencer/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Загрузка медиа
   * @returns Media Медиа загружено
   * @throws ApiError
   */
  public static influencerMediaPost({
    formData,
  }: {
    formData: {
      file?: Blob;
      tags?: Array<string>;
    };
  }): CancelablePromise<Media> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/media",
      formData: formData,
      mediaType: "multipart/form-data",
    });
  }
  /**
   * Поиск медиа инфлюэнсера
   * @returns PagedMediaResponse Результаты поиска
   * @throws ApiError
   */
  public static influencerMediaSearchPost({
    requestBody,
  }: {
    requestBody: MediaSearchRequest;
  }): CancelablePromise<PagedMediaResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/media/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Обновить медиа
   * @returns Media Медиа обновлено
   * @throws ApiError
   */
  public static influencerMediaMediaIdPatch({
    mediaId,
    requestBody,
  }: {
    mediaId: string;
    requestBody: UpdateMediaRequest;
  }): CancelablePromise<Media> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/media/{mediaId}",
      path: {
        mediaId: mediaId,
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
   * Удалить медиа
   * @returns void
   * @throws ApiError
   */
  public static influencerMediaMediaIdDelete({
    mediaId,
  }: {
    mediaId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/influencer/media/{mediaId}",
      path: {
        mediaId: mediaId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
