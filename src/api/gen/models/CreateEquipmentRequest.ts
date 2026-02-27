/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EquipmentCategory } from "./EquipmentCategory";
/**
 * Запрос на создание оборудования
 */
export type CreateEquipmentRequest = {
  code: string;
  name: string;
  category: EquipmentCategory;
  mediaIds?: Array<string>;
};
