/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseTemplate } from "./ExerciseTemplate";
import type { Media } from "./Media";
export type WorkoutTemplate = {
  id: string;
  dayOrder: number;
  title?: string;
  coachNote?: string;
  exercises?: Array<ExerciseTemplate>;
  media?: Array<Media>;
};
