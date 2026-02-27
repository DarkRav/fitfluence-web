/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExerciseRequest } from "../models/CreateExerciseRequest";
import type { Exercise } from "../models/Exercise";
import type { ExerciseFilter } from "../models/ExerciseFilter";
import type { PagedExerciseResponse } from "../models/PagedExerciseResponse";
import type { UpdateExerciseRequest } from "../models/UpdateExerciseRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ExercisesService {
  /**
   * Создать упражнение
   * @returns Exercise Упражнение создано
   * @throws ApiError
   */
  public static exercisesPost({
    requestBody,
  }: {
    requestBody: CreateExerciseRequest;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/exercises",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить список упражнений с фильтром и пагинацией
   * @returns PagedExerciseResponse Список упражнений
   * @throws ApiError
   */
  public static exercisesSearch({
    requestBody,
  }: {
    /**
     * Фильтры и пагинация
     */
    requestBody?: {
      filter?: ExerciseFilter;
      page?: number;
      size?: number;
    };
  }): CancelablePromise<PagedExerciseResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/exercises/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить упражнение по ID
   * @returns Exercise Успешно
   * @throws ApiError
   */
  public static exercisesExerciseIdGet({
    exerciseId,
  }: {
    exerciseId: string;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить упражнение
   * @returns Exercise Упражнение обновлено
   * @throws ApiError
   */
  public static exercisesExerciseIdPatch({
    exerciseId,
    requestBody,
  }: {
    exerciseId: string;
    requestBody: UpdateExerciseRequest;
  }): CancelablePromise<Exercise> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить упражнение
   * @returns void
   * @throws ApiError
   */
  public static exercisesExerciseIdDelete({
    exerciseId,
  }: {
    exerciseId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/exercises/{exerciseId}",
      path: {
        exerciseId: exerciseId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
