/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from "./Media";
import type { MuscleGroup } from "./MuscleGroup";
/**
 * Мышечная группа
 */
export type Muscle = {
  id: string;
  code: string;
  name: string;
  muscleGroup?: MuscleGroup;
  description?: string;
  media?: Array<Media>;
};
