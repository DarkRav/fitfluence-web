/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Exercise } from "./Exercise";
import type { SetExecution } from "./SetExecution";
export type ExerciseExecution = {
  id: string;
  workoutInstanceId: string;
  exerciseTemplateId?: string;
  workoutPlanId?: string;
  exerciseId: string;
  orderIndex: number;
  notes?: string;
  plannedSets?: number;
  plannedRepsMin?: number;
  plannedRepsMax?: number;
  plannedTargetRpe?: number;
  plannedRestSeconds?: number;
  plannedNotes?: string;
  progressionPolicyId?: string;
  exercise?: Exercise;
  sets?: Array<SetExecution>;
};
