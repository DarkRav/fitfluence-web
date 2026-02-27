/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MuscleGroup } from "./MuscleGroup";
/**
 * Фильтр для поиска мышечных групп
 */
export type MuscleFilter = {
  /**
   * Поиск по имени или описанию
   */
  search?: string;
  muscleGroups?: Array<MuscleGroup>;
  mediaTags?: Array<string>;
};
