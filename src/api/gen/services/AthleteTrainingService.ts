/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbandonWorkoutRequest } from "../models/AbandonWorkoutRequest";
import type { ActiveEnrollmentProgress } from "../models/ActiveEnrollmentProgress";
import type { AddCustomWorkoutExerciseRequest } from "../models/AddCustomWorkoutExerciseRequest";
import type { AthleteCalendarResponse } from "../models/AthleteCalendarResponse";
import type { AthleteExerciseHistoryResponse } from "../models/AthleteExerciseHistoryResponse";
import type { AthletePersonalRecordsResponse } from "../models/AthletePersonalRecordsResponse";
import type { AthleteRecoveryTodayResponse } from "../models/AthleteRecoveryTodayResponse";
import type { AthleteStatsSummaryResponse } from "../models/AthleteStatsSummaryResponse";
import type { AthleteSyncStatusResponse } from "../models/AthleteSyncStatusResponse";
import type { AthleteWorkoutComparisonResponse } from "../models/AthleteWorkoutComparisonResponse";
import type { CompleteWorkoutRequest } from "../models/CompleteWorkoutRequest";
import type { CreateCustomWorkoutRequest } from "../models/CreateCustomWorkoutRequest";
import type { CreateEnrollmentRequest } from "../models/CreateEnrollmentRequest";
import type { Exercise } from "../models/Exercise";
import type { ExerciseExecution } from "../models/ExerciseExecution";
import type { ExerciseLastPerformanceResponse } from "../models/ExerciseLastPerformanceResponse";
import type { ExercisesSearchRequest } from "../models/ExercisesSearchRequest";
import type { MuscleGroup } from "../models/MuscleGroup";
import type { PagedExerciseResponse } from "../models/PagedExerciseResponse";
import type { PagedWorkoutDetailsResponse } from "../models/PagedWorkoutDetailsResponse";
import type { ProgramEnrollment } from "../models/ProgramEnrollment";
import type { SetExecution } from "../models/SetExecution";
import type { StartWorkoutRequest } from "../models/StartWorkoutRequest";
import type { UpdateCustomWorkoutExerciseRequest } from "../models/UpdateCustomWorkoutExerciseRequest";
import type { UpdateEnrollmentStatusRequest } from "../models/UpdateEnrollmentStatusRequest";
import type { UpsertSetExecutionRequest } from "../models/UpsertSetExecutionRequest";
import type { WorkoutDetails } from "../models/WorkoutDetails";
import type { WorkoutInstance } from "../models/WorkoutInstance";
import type { WorkoutLastCompletionResponse } from "../models/WorkoutLastCompletionResponse";
import type { WorkoutScheduleResponse } from "../models/WorkoutScheduleResponse";
import type { WorkoutSearchRequest } from "../models/WorkoutSearchRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AthleteTrainingService {
  /**
   * Начало прохождения программы
   * @returns ProgramEnrollment Enrollment создан
   * @throws ApiError
   */
  public static athleteEnrollmentsPost({
    requestBody,
  }: {
    requestBody: CreateEnrollmentRequest;
  }): CancelablePromise<ProgramEnrollment> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/enrollments",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Начать программу для текущего атлета
   * @returns ProgramEnrollment Enrollment создан
   * @throws ApiError
   */
  public static athleteEnrollmentsSelfPost({
    requestBody,
  }: {
    requestBody: {
      programVersionId: string;
    };
  }): CancelablePromise<ProgramEnrollment> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/enrollments/self",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить текущее состояние прохождения программы
   * @returns ProgramEnrollment Enrollment
   * @throws ApiError
   */
  public static athleteEnrollmentsEnrollmentIdGet({
    enrollmentId,
  }: {
    enrollmentId: string;
  }): CancelablePromise<ProgramEnrollment> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/enrollments/{enrollmentId}",
      path: {
        enrollmentId: enrollmentId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Управление статусом прохождения программы
   * @returns ProgramEnrollment Статус обновлен
   * @throws ApiError
   */
  public static athleteEnrollmentsEnrollmentIdPatch({
    enrollmentId,
    requestBody,
  }: {
    enrollmentId: string;
    requestBody: UpdateEnrollmentStatusRequest;
  }): CancelablePromise<ProgramEnrollment> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/athlete/enrollments/{enrollmentId}",
      path: {
        enrollmentId: enrollmentId,
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
   * Получение расписания тренировок по программе
   * @returns WorkoutScheduleResponse Расписание тренировок
   * @throws ApiError
   */
  public static athleteEnrollmentsEnrollmentIdScheduleGet({
    enrollmentId,
  }: {
    enrollmentId: string;
  }): CancelablePromise<WorkoutScheduleResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/enrollments/{enrollmentId}/schedule",
      path: {
        enrollmentId: enrollmentId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Прогресс по активной программе текущего атлета
   * @returns ActiveEnrollmentProgress Текущее состояние активной программы. При отсутствии активной программы поля возвращаются как null.
   * @throws ApiError
   */
  public static athleteEnrollmentsActiveGet(): CancelablePromise<ActiveEnrollmentProgress> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/enrollments/active",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Агрегированная сводка статистики атлета для домашнего экрана
   * @returns AthleteStatsSummaryResponse Сводная статистика атлета
   * @throws ApiError
   */
  public static athleteStatsSummaryGet(): CancelablePromise<AthleteStatsSummaryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/stats/summary",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Календарь тренировок атлета за месяц
   * @returns AthleteCalendarResponse Календарь тренировок за месяц
   * @throws ApiError
   */
  public static athleteCalendarGet({
    month,
  }: {
    month: string;
  }): CancelablePromise<AthleteCalendarResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/calendar",
      query: {
        month: month,
      },
      errors: {
        400: `Некорректный запрос`,
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Последний performance по упражнению
   * @returns ExerciseLastPerformanceResponse Последнее завершённое выполнение упражнения
   * @throws ApiError
   */
  public static athleteExercisesExerciseIdLastPerformanceGet({
    exerciseId,
  }: {
    exerciseId: string;
  }): CancelablePromise<ExerciseLastPerformanceResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/exercises/{exerciseId}/last-performance",
      path: {
        exerciseId: exerciseId,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * История выполнений упражнения текущего атлета
   * @returns AthleteExerciseHistoryResponse История выполнений упражнения (плоский формат для клиента iOS)
   * @throws ApiError
   */
  public static athleteExercisesExerciseIdHistoryGet({
    exerciseId,
    dateFrom,
    dateTo,
    onlyCompleted = true,
    page,
    size = 20,
  }: {
    exerciseId: string;
    dateFrom?: string;
    dateTo?: string;
    onlyCompleted?: boolean;
    page?: number;
    size?: number;
  }): CancelablePromise<AthleteExerciseHistoryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/exercises/{exerciseId}/history",
      path: {
        exerciseId: exerciseId,
      },
      query: {
        dateFrom: dateFrom,
        dateTo: dateTo,
        onlyCompleted: onlyCompleted,
        page: page,
        size: size,
      },
      errors: {
        400: `Некорректный запрос`,
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Personal records текущего атлета по упражнениям
   * @returns AthletePersonalRecordsResponse Список personal records текущего атлета
   * @throws ApiError
   */
  public static athletePrsGet({
    exerciseId,
    muscleGroup,
    page,
    size = 20,
  }: {
    exerciseId?: string;
    muscleGroup?: MuscleGroup;
    page?: number;
    size?: number;
  }): CancelablePromise<AthletePersonalRecordsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/prs",
      query: {
        exerciseId: exerciseId,
        muscleGroup: muscleGroup,
        page: page,
        size: size,
      },
      errors: {
        400: `Некорректный запрос`,
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Последнее завершение тренировки по workout template id
   * @returns WorkoutLastCompletionResponse Агрегированная метрика последнего завершения
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutIdLastCompletionGet({
    workoutId,
  }: {
    workoutId: string;
  }): CancelablePromise<WorkoutLastCompletionResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/workouts/{workoutId}/last-completion",
      path: {
        workoutId: workoutId,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Daily recovery/readiness signal для текущего атлета
   * @returns AthleteRecoveryTodayResponse Текущий recovery-сигнал
   * @throws ApiError
   */
  public static athleteRecoveryTodayGet(): CancelablePromise<AthleteRecoveryTodayResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/recovery/today",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Открытие конкретной тренировки с упражнениями
   * @returns WorkoutDetails Детали тренировки
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdGet({
    workoutInstanceId,
  }: {
    workoutInstanceId: string;
  }): CancelablePromise<WorkoutDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/workouts/{workoutInstanceId}",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Сравнение текущей завершённой тренировки с предыдущей по этому же workout template
   * @returns AthleteWorkoutComparisonResponse Разница относительно предыдущей тренировки. Если сравнивать не с чем, поля delta возвращаются как null.
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdComparisonGet({
    workoutInstanceId,
  }: {
    workoutInstanceId: string;
  }): CancelablePromise<AthleteWorkoutComparisonResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/workouts/{workoutInstanceId}/comparison",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
        422: `Семантически некорректный запрос`,
      },
    });
  }
  /**
   * Начать тренировку
   * @returns WorkoutInstance Тренировка начата
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdStartPost({
    workoutInstanceId,
    requestBody,
  }: {
    workoutInstanceId: string;
    requestBody?: StartWorkoutRequest;
  }): CancelablePromise<WorkoutInstance> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/{workoutInstanceId}/start",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Фиксация факта выполнения тренировки
   * @returns WorkoutInstance Тренировка завершена
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdCompletePost({
    workoutInstanceId,
    requestBody,
  }: {
    workoutInstanceId: string;
    requestBody?: CompleteWorkoutRequest;
  }): CancelablePromise<WorkoutInstance> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/{workoutInstanceId}/complete",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Прервать тренировку без удаления данных
   * @returns WorkoutInstance Тренировка переведена в статус ABANDONED
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdAbandonPost({
    workoutInstanceId,
    requestBody,
  }: {
    workoutInstanceId: string;
    requestBody?: AbandonWorkoutRequest;
  }): CancelablePromise<WorkoutInstance> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/{workoutInstanceId}/abandon",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
        409: `Конфликт ресурса`,
      },
    });
  }
  /**
   * Диагностика серверной синхронизации атлета
   * @returns AthleteSyncStatusResponse Серверный статус синхронизации по данным атлета
   * @throws ApiError
   */
  public static athleteSyncStatusGet(): CancelablePromise<AthleteSyncStatusResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/sync/status",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Ввод подхода (вес, повторения, RPE)
   * @returns SetExecution Подход сохранен
   * @throws ApiError
   */
  public static athleteExerciseExecutionsExerciseExecutionIdSetsSetNumberPut({
    exerciseExecutionId,
    setNumber,
    requestBody,
  }: {
    exerciseExecutionId: string;
    setNumber: number;
    requestBody: UpsertSetExecutionRequest;
  }): CancelablePromise<SetExecution> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/v1/athlete/exercise-executions/{exerciseExecutionId}/sets/{setNumber}",
      path: {
        exerciseExecutionId: exerciseExecutionId,
        setNumber: setNumber,
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
   * Поиск тренировок атлета
   * @returns PagedWorkoutDetailsResponse Список тренировок
   * @throws ApiError
   */
  public static athleteWorkoutsSearchPost({
    requestBody,
  }: {
    requestBody: WorkoutSearchRequest;
  }): CancelablePromise<PagedWorkoutDetailsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Поиск упражнений для атлета
   * @returns PagedExerciseResponse Список упражнений
   * @throws ApiError
   */
  public static athleteExercisesSearchPost({
    requestBody,
  }: {
    requestBody?: ExercisesSearchRequest;
  }): CancelablePromise<PagedExerciseResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/exercises/search",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Получить упражнение для атлета по id
   * @returns Exercise Детали упражнения
   * @throws ApiError
   */
  public static athleteExercisesExerciseIdGet({
    exerciseId,
  }: {
    exerciseId: string;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создать кастомную тренировку
   * @returns WorkoutInstance Тренировка создана
   * @throws ApiError
   */
  public static athleteWorkoutsCustomPost({
    requestBody,
  }: {
    requestBody: CreateCustomWorkoutRequest;
  }): CancelablePromise<WorkoutInstance> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/custom",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить кастомную тренировку по id
   * @returns WorkoutDetails Детали кастомной тренировки
   * @throws ApiError
   */
  public static athleteWorkoutsCustomWorkoutInstanceIdGet({
    workoutInstanceId,
  }: {
    workoutInstanceId: string;
  }): CancelablePromise<WorkoutDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/workouts/custom/{workoutInstanceId}",
      path: {
        workoutInstanceId: workoutInstanceId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Добавить упражнение в кастомную тренировку
   * @returns ExerciseExecution Упражнение добавлено
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdExercisesPost({
    workoutInstanceId,
    requestBody,
  }: {
    workoutInstanceId: string;
    requestBody: AddCustomWorkoutExerciseRequest;
  }): CancelablePromise<ExerciseExecution> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/workouts/{workoutInstanceId}/exercises",
      path: {
        workoutInstanceId: workoutInstanceId,
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
   * Обновить упражнение в кастомной тренировке
   * @returns ExerciseExecution Упражнение обновлено
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdExercisesExerciseExecutionIdPatch({
    workoutInstanceId,
    exerciseExecutionId,
    requestBody,
  }: {
    workoutInstanceId: string;
    exerciseExecutionId: string;
    requestBody: UpdateCustomWorkoutExerciseRequest;
  }): CancelablePromise<ExerciseExecution> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/athlete/workouts/{workoutInstanceId}/exercises/{exerciseExecutionId}",
      path: {
        workoutInstanceId: workoutInstanceId,
        exerciseExecutionId: exerciseExecutionId,
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
   * Удалить упражнение из кастомной тренировки
   * @returns void
   * @throws ApiError
   */
  public static athleteWorkoutsWorkoutInstanceIdExercisesExerciseExecutionIdDelete({
    workoutInstanceId,
    exerciseExecutionId,
  }: {
    workoutInstanceId: string;
    exerciseExecutionId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/athlete/workouts/{workoutInstanceId}/exercises/{exerciseExecutionId}",
      path: {
        workoutInstanceId: workoutInstanceId,
        exerciseExecutionId: exerciseExecutionId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
