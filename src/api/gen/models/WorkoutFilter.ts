/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkoutSource } from "./WorkoutSource";
import type { WorkoutStatusFilter } from "./WorkoutStatusFilter";
export type WorkoutFilter = {
  source?: WorkoutSource;
  dateFrom?: string;
  dateTo?: string;
  status?: WorkoutStatusFilter;
};
