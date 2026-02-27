/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProgressionPolicyRequest } from "../models/CreateProgressionPolicyRequest";
import type { PagedProgressionPolicyResponse } from "../models/PagedProgressionPolicyResponse";
import type { ProgressionPoliciesSearchRequest } from "../models/ProgressionPoliciesSearchRequest";
import type { ProgressionPolicy } from "../models/ProgressionPolicy";
import type { UpdateProgressionPolicyRequest } from "../models/UpdateProgressionPolicyRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ProgressionPoliciesService {
  /**
   * Создать политику прогрессии
   * @returns ProgressionPolicy Политика создана
   * @throws ApiError
   */
  public static adminProgressionPoliciesPost({
    requestBody,
  }: {
    requestBody: CreateProgressionPolicyRequest;
  }): CancelablePromise<ProgressionPolicy> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/progression-policies",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Поиск политик прогрессии
   * @returns PagedProgressionPolicyResponse Результаты поиска
   * @throws ApiError
   */
  public static adminProgressionPoliciesSearchPost({
    requestBody,
  }: {
    requestBody: ProgressionPoliciesSearchRequest;
  }): CancelablePromise<PagedProgressionPolicyResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/progression-policies/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить политику прогрессии
   * @returns ProgressionPolicy Политика прогрессии
   * @throws ApiError
   */
  public static adminProgressionPoliciesIdGet({
    id,
  }: {
    id: string;
  }): CancelablePromise<ProgressionPolicy> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/progression-policies/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить политику прогрессии
   * @returns ProgressionPolicy Политика обновлена
   * @throws ApiError
   */
  public static adminProgressionPoliciesIdPatch({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: UpdateProgressionPolicyRequest;
  }): CancelablePromise<ProgressionPolicy> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/progression-policies/{id}",
      path: {
        id: id,
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
   * Архивировать политику прогрессии
   * @returns void
   * @throws ApiError
   */
  public static adminProgressionPoliciesIdDelete({ id }: { id: string }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/progression-policies/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Поиск политик прогрессии для инфлюэнсера
   * @returns PagedProgressionPolicyResponse Результаты поиска
   * @throws ApiError
   */
  public static influencerProgressionPoliciesSearchPost({
    requestBody,
  }: {
    requestBody: ProgressionPoliciesSearchRequest;
  }): CancelablePromise<PagedProgressionPolicyResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/progression-policies/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить политику прогрессии для инфлюэнсера
   * @returns ProgressionPolicy Политика прогрессии
   * @throws ApiError
   */
  public static influencerProgressionPoliciesIdGet({
    id,
  }: {
    id: string;
  }): CancelablePromise<ProgressionPolicy> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/progression-policies/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
