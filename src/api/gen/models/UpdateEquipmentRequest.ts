/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EquipmentCategory } from "./EquipmentCategory";
/**
 * Запрос на обновление оборудования
 */
export type UpdateEquipmentRequest = {
  name?: string;
  category?: EquipmentCategory;
  mediaIds?: Array<string>;
};
