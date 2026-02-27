/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagedProgramResponse } from "../models/PagedProgramResponse";
import type { ProgramDetails } from "../models/ProgramDetails";
import type { ProgramsSearchRequest } from "../models/ProgramsSearchRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class PublicProgramsService {
  /**
   * Просмотр списка опубликованных программ с фильтрами
   * @returns PagedProgramResponse Список опубликованных программ
   * @throws ApiError
   */
  public static programsPublishedSearch({
    requestBody,
  }: {
    requestBody?: ProgramsSearchRequest;
  }): CancelablePromise<PagedProgramResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/programs/published/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Просмотр описания, инфлюэнсера, требований и структуры программы
   * @returns ProgramDetails Детали программы
   * @throws ApiError
   */
  public static programsProgramIdGet({
    programId,
  }: {
    programId: string;
  }): CancelablePromise<ProgramDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/programs/{programId}",
      path: {
        programId: programId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Опубликованные программы инфлюэнсера
   * @returns PagedProgramResponse Список программ
   * @throws ApiError
   */
  public static publicProgramsInfluencersInfluencerIdPublishedGet({
    influencerId,
    page,
    size,
  }: {
    influencerId: string;
    page?: number;
    size?: number;
  }): CancelablePromise<PagedProgramResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencers/{influencerId}/programs/published",
      path: {
        influencerId: influencerId,
      },
      query: {
        page: page,
        size: size,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Подборка лучших программ
   * @returns PagedProgramResponse Список программ
   * @throws ApiError
   */
  public static publicProgramsFeaturedGet({
    page,
    size,
  }: {
    page?: number;
    size?: number;
  }): CancelablePromise<PagedProgramResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/programs/featured",
      query: {
        page: page,
        size: size,
      },
    });
  }
}
