/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from "./DifficultyLevel";
import type { Equipment } from "./Equipment";
import type { Media } from "./Media";
import type { MovementPattern } from "./MovementPattern";
import type { Muscle } from "./Muscle";
/**
 * Упражнение
 */
export type Exercise = {
  id: string;
  code: string;
  name: string;
  description?: string;
  movementPattern?: MovementPattern;
  difficultyLevel?: DifficultyLevel;
  isBodyweight?: boolean;
  createdByInfluencerId?: string;
  muscles?: Array<Muscle>;
  media?: Array<Media>;
  equipment?: Array<Equipment>;
};
