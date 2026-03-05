/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkoutInstanceStatus } from "./WorkoutInstanceStatus";
import type { WorkoutSource } from "./WorkoutSource";
export type WorkoutInstance = {
  id: string;
  enrollmentId?: string;
  workoutTemplateId?: string;
  title?: string;
  source: WorkoutSource;
  status?: WorkoutInstanceStatus | null;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  notes?: string;
  programId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
