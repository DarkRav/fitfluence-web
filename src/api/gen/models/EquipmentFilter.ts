/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EquipmentCategory } from "./EquipmentCategory";
/**
 * Фильтр для поиска оборудования
 */
export type EquipmentFilter = {
  search?: string;
  category?: EquipmentCategory;
  mediaTags?: Array<string>;
};
