/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeResponse } from "../models/MeResponse";
import type { UpdateMeRequest } from "../models/UpdateMeRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MeService {
  /**
   * Получить текущего пользователя
   * Identity берётся из OIDC token claims, профиль хранится в системе Fitfluence.
   * @returns MeResponse Текущий пользователь
   * @throws ApiError
   */
  public static meGet(): CancelablePromise<MeResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/me",
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Обновить базовый профиль пользователя
   * @returns MeResponse Профиль обновлен
   * @throws ApiError
   */
  public static mePatch({
    requestBody,
  }: {
    requestBody: UpdateMeRequest;
  }): CancelablePromise<MeResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
}
