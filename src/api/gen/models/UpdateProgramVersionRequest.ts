/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgramVersionStatus } from "./ProgramVersionStatus";
export type UpdateProgramVersionRequest = {
  level?: string;
  frequencyPerWeek?: number;
  requirements?: Record<string, any>;
  status?: ProgramVersionStatus;
};
