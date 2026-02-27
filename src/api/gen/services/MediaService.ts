/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentMediaType } from "../models/ContentMediaType";
import type { Media } from "../models/Media";
import type { MediaFilter } from "../models/MediaFilter";
import type { PagedMediaResponse } from "../models/PagedMediaResponse";
import type { UpdateMediaRequest } from "../models/UpdateMediaRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MediaService {
  /**
   * Загрузить медиа
   * @returns Media Успешно
   * @throws ApiError
   */
  public static mediaPost({
    formData,
  }: {
    formData: {
      file: Blob;
      type: ContentMediaType;
      mimeType?: string;
      tags?: Array<string>;
    };
  }): CancelablePromise<Media> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/media",
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить список медиа с фильтром и пагинацией
   * @returns PagedMediaResponse Успешно
   * @throws ApiError
   */
  public static mediaSearch({
    requestBody,
  }: {
    /**
     * Фильтры и пагинация
     */
    requestBody?: {
      filter?: MediaFilter;
      page?: number;
      size?: number;
    };
  }): CancelablePromise<PagedMediaResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/media/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить медиа по ID
   * @returns Media Успешно
   * @throws ApiError
   */
  public static mediaMediaIdGet({ mediaId }: { mediaId: string }): CancelablePromise<Media> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/media/{mediaId}",
      path: {
        mediaId: mediaId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить описание медиа
   * @returns Media Успешно
   * @throws ApiError
   */
  public static mediaMediaIdPatch({
    mediaId,
    requestBody,
  }: {
    mediaId: string;
    requestBody: UpdateMediaRequest;
  }): CancelablePromise<Media> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/media/{mediaId}",
      path: {
        mediaId: mediaId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить медиа
   * @returns void
   * @throws ApiError
   */
  public static mediaMediaIdDelete({ mediaId }: { mediaId: string }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/media/{mediaId}",
      path: {
        mediaId: mediaId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
