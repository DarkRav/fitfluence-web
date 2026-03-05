/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAthleteFollowRequest } from "../models/CreateAthleteFollowRequest";
import type { FollowedInfluencer } from "../models/FollowedInfluencer";
import type { FollowStatusResponse } from "../models/FollowStatusResponse";
import type { PagedFollowedInfluencerResponse } from "../models/PagedFollowedInfluencerResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AthleteFollowsService {
  /**
   * Список подписок текущего атлета на инфлюэнсеров
   * @returns PagedFollowedInfluencerResponse Пагинированный список подписок текущего атлета
   * @throws ApiError
   */
  public static athleteFollowsGet({
    page,
    size = 20,
    search,
  }: {
    page?: number;
    size?: number;
    search?: string;
  }): CancelablePromise<PagedFollowedInfluencerResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/follows",
      query: {
        page: page,
        size: size,
        search: search,
      },
      errors: {
        400: `Некорректный запрос`,
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
      },
    });
  }
  /**
   * Подписаться на публичного инфлюэнсера
   * @returns FollowedInfluencer Подписка уже существовала (идемпотентный повторный follow)
   * @throws ApiError
   */
  public static athleteFollowsPost({
    requestBody,
  }: {
    requestBody: CreateAthleteFollowRequest;
  }): CancelablePromise<FollowedInfluencer> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/follows",
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
  /**
   * Проверить подписку текущего атлета на инфлюэнсера
   * @returns FollowStatusResponse Статус подписки
   * @throws ApiError
   */
  public static athleteFollowsInfluencerIdGet({
    influencerId,
  }: {
    influencerId: string;
  }): CancelablePromise<FollowStatusResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/follows/{influencerId}",
      path: {
        influencerId: influencerId,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Отписаться от инфлюэнсера
   * @returns void
   * @throws ApiError
   */
  public static athleteFollowsInfluencerIdDelete({
    influencerId,
  }: {
    influencerId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/athlete/follows/{influencerId}",
      path: {
        influencerId: influencerId,
      },
      errors: {
        401: `Требуется авторизация`,
        403: `Доступ запрещён`,
        404: `Ресурс не найден`,
      },
    });
  }
}
