/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from "./DifficultyLevel";
import type { MovementPattern } from "./MovementPattern";
import type { MuscleGroup } from "./MuscleGroup";
/**
 * Фильтр для поиска упражнений
 */
export type ExerciseFilter = {
  search?: string;
  movementPattern?: MovementPattern;
  difficultyLevel?: DifficultyLevel;
  muscleIds?: Array<string>;
  muscleGroups?: Array<MuscleGroup>;
  mediaTags?: Array<string>;
  equipmentIds?: Array<string>;
};
