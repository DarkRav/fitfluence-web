/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from "./DifficultyLevel";
import type { MovementPattern } from "./MovementPattern";
/**
 * Запрос на создание упражнения
 */
export type CreateExerciseRequest = {
  code: string;
  name: string;
  description?: string;
  movementPattern?: MovementPattern;
  difficultyLevel?: DifficultyLevel;
  isBodyweight?: boolean;
  muscleIds?: Array<string>;
  mediaIds?: Array<string>;
  equipmentIds?: Array<string>;
};
