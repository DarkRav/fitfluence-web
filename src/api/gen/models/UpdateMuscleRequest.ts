/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MuscleGroup } from "./MuscleGroup";
/**
 * Запрос на обновление мышцы
 */
export type UpdateMuscleRequest = {
  name?: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  mediaIds?: Array<string>;
};
