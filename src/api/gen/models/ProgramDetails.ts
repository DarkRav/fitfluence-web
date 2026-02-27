/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgramListItem } from "./ProgramListItem";
import type { ProgramVersionSummary } from "./ProgramVersionSummary";
import type { WorkoutTemplate } from "./WorkoutTemplate";
export type ProgramDetails = ProgramListItem & {
  versions?: Array<ProgramVersionSummary>;
  workouts?: Array<WorkoutTemplate>;
};
