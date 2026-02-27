/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Exercise } from "./Exercise";
export type ExerciseTemplate = {
  id: string;
  exercise: Exercise;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
  orderIndex?: number;
};
