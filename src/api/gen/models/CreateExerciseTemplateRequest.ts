/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateExerciseTemplateRequest = {
  exerciseId: string;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
  progressionPolicyId?: string;
};
