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
   * @returns MeResponse Текущий пользователь
   * @throws ApiError
   */
  public static meGet(): CancelablePromise<MeResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/me",
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
      },
    });
  }
}
