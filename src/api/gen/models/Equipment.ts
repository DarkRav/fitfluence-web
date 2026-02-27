/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EquipmentCategory } from "./EquipmentCategory";
import type { Media } from "./Media";
/**
 * Спортивное оборудование
 */
export type Equipment = {
  id: string;
  code: string;
  name: string;
  category: EquipmentCategory;
  media?: Array<Media>;
};
