/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AthleteProfile } from "../models/AthleteProfile";
import type { CreateAthleteProfileRequest } from "../models/CreateAthleteProfileRequest";
import type { CreateInfluencerProfileRequest } from "../models/CreateInfluencerProfileRequest";
import type { InfluencerProfile } from "../models/InfluencerProfile";
import type { UpdateAthleteProfileRequest } from "../models/UpdateAthleteProfileRequest";
import type { UpdateInfluencerProfileRequest } from "../models/UpdateInfluencerProfileRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ProfilesService {
  /**
   * Создать профиль атлета
   * @returns AthleteProfile Профиль создан
   * @throws ApiError
   */
  public static athleteProfilePost({
    requestBody,
  }: {
    requestBody: CreateAthleteProfileRequest;
  }): CancelablePromise<AthleteProfile> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/athlete/profile",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить профиль атлета
   * @returns AthleteProfile Профиль атлета
   * @throws ApiError
   */
  public static athleteProfileGet(): CancelablePromise<AthleteProfile> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/athlete/profile",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить профиль атлета
   * @returns AthleteProfile Профиль обновлен
   * @throws ApiError
   */
  public static athleteProfilePatch({
    requestBody,
  }: {
    requestBody: UpdateAthleteProfileRequest;
  }): CancelablePromise<AthleteProfile> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/athlete/profile",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Создать профиль инфлюэнсера
   * @returns InfluencerProfile Профиль создан
   * @throws ApiError
   */
  public static influencerProfilePost({
    requestBody,
  }: {
    requestBody: CreateInfluencerProfileRequest;
  }): CancelablePromise<InfluencerProfile> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/influencer/profile",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить профиль инфлюэнсера
   * @returns InfluencerProfile Профиль инфлюэнсера
   * @throws ApiError
   */
  public static influencerProfileGet(): CancelablePromise<InfluencerProfile> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/influencer/profile",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить профиль инфлюэнсера
   * @returns InfluencerProfile Профиль обновлен
   * @throws ApiError
   */
  public static influencerProfilePatch({
    requestBody,
  }: {
    requestBody: UpdateInfluencerProfileRequest;
  }): CancelablePromise<InfluencerProfile> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/influencer/profile",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
        404: `Ресурс не найден`,
      },
    });
  }
}
