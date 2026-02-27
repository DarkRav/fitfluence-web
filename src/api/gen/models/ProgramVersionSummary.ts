/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgramVersionStatus } from "./ProgramVersionStatus";
export type ProgramVersionSummary = {
  id: string;
  versionNumber: number;
  status: ProgramVersionStatus;
  publishedAt?: string;
  level?: string;
  frequencyPerWeek?: number;
  requirements?: Record<string, any>;
};
