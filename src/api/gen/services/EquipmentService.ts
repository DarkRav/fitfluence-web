/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEquipmentRequest } from "../models/CreateEquipmentRequest";
import type { Equipment } from "../models/Equipment";
import type { EquipmentFilter } from "../models/EquipmentFilter";
import type { PagedEquipmentResponse } from "../models/PagedEquipmentResponse";
import type { UpdateEquipmentRequest } from "../models/UpdateEquipmentRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class EquipmentService {
  /**
   * Создать оборудование
   * @returns Equipment Успешно
   * @throws ApiError
   */
  public static equipmentPost({
    requestBody,
  }: {
    requestBody: CreateEquipmentRequest;
  }): CancelablePromise<Equipment> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/equipment",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить список оборудования с фильтром и пагинацией
   * @returns PagedEquipmentResponse Успешно
   * @throws ApiError
   */
  public static equipmentSearch({
    requestBody,
  }: {
    /**
     * Фильтры и пагинация
     */
    requestBody?: {
      filter?: EquipmentFilter;
      page?: number;
      size?: number;
    };
  }): CancelablePromise<PagedEquipmentResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/admin/equipment/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Некорректный запрос`,
      },
    });
  }
  /**
   * Получить оборудование по ID
   * @returns Equipment Успешно
   * @throws ApiError
   */
  public static equipmentEquipmentIdGet({
    equipmentId,
  }: {
    equipmentId: string;
  }): CancelablePromise<Equipment> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/admin/equipment/{equipmentId}",
      path: {
        equipmentId: equipmentId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Обновить оборудование
   * @returns Equipment Успешно
   * @throws ApiError
   */
  public static equipmentEquipmentIdPatch({
    equipmentId,
    requestBody,
  }: {
    equipmentId: string;
    requestBody: UpdateEquipmentRequest;
  }): CancelablePromise<Equipment> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/admin/equipment/{equipmentId}",
      path: {
        equipmentId: equipmentId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
  /**
   * Удалить оборудование
   * @returns void
   * @throws ApiError
   */
  public static equipmentEquipmentIdDelete({
    equipmentId,
  }: {
    equipmentId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/admin/equipment/{equipmentId}",
      path: {
        equipmentId: equipmentId,
      },
      errors: {
        404: `Ресурс не найден`,
      },
    });
  }
}
