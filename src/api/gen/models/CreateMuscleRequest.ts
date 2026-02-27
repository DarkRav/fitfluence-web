/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MuscleGroup } from "./MuscleGroup";
/**
 * Запрос на создание новой мышцы
 */
export type CreateMuscleRequest = {
  code: string;
  name: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  mediaIds?: Array<string>;
};
