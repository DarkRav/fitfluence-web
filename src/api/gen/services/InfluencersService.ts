/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InfluencerPublicCard } from "../models/InfluencerPublicCard";
import type { InfluencersSearchRequest } from "../models/InfluencersSearchRequest";
import type { PagedInfluencerResponse } from "../models/PagedInfluencerResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class InfluencersService {
  /**
   * Публичная карточка инфлюэнсера
   * @returns InfluencerPublicCard Карточка инфлюэнсера
   * @throws ApiError
   */
  public static influencersInfluencerIdGet({
    influencerId,
  }: {
    influencerId: string;
  }): CancelablePromise<InfluencerPublicCard> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencers/{influencerId}",
      path: {
        influencerId: influencerId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Поиск инфлюэнсеров
   * @returns PagedInfluencerResponse Результаты поиска
   * @throws ApiError
   */
  public static influencersSearchPost({
    requestBody,
  }: {
    requestBody: InfluencersSearchRequest;
  }): CancelablePromise<PagedInfluencerResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencers/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
}
