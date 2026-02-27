/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMuscleRequest } from "../models/CreateMuscleRequest";
import type { Muscle } from "../models/Muscle";
import type { MuscleFilter } from "../models/MuscleFilter";
import type { PagedMuscleResponse } from "../models/PagedMuscleResponse";
import type { UpdateMuscleRequest } from "../models/UpdateMuscleRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MusclesService {
  /**
   * Создать мышцу
   * @returns Muscle Мышца создана
   * @throws ApiError
   */
  public static musclesPost({
    requestBody,
  }: {
    requestBody: CreateMuscleRequest;
  }): CancelablePromise<Muscle> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/muscles",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить список мышц с фильтром и пагинацией
   * @returns PagedMuscleResponse Список мышц
   * @throws ApiError
   */
  public static musclesSearch({
    requestBody,
  }: {
    /**
     * Фильтры и пагинация
     */
    requestBody?: {
      filter?: MuscleFilter;
      page?: number;
      size?: number;
    };
  }): CancelablePromise<PagedMuscleResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/muscles/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить мышцу по ID
   * @returns Muscle Успешно
   * @throws ApiError
   */
  public static musclesMuscleIdGet({ muscleId }: { muscleId: string }): CancelablePromise<Muscle> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/muscles/{muscleId}",
      path: {
        muscleId: muscleId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить мышцу
   * @returns Muscle Мышца обновлена
   * @throws ApiError
   */
  public static musclesMuscleIdPatch({
    muscleId,
    requestBody,
  }: {
    muscleId: string;
    requestBody: UpdateMuscleRequest;
  }): CancelablePromise<Muscle> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/muscles/{muscleId}",
      path: {
        muscleId: muscleId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить мышцу
   * @returns void
   * @throws ApiError
   */
  public static musclesMuscleIdDelete({ muscleId }: { muscleId: string }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/muscles/{muscleId}",
      path: {
        muscleId: muscleId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
