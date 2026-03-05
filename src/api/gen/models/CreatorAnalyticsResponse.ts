/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatorProgramAnalytics } from "./CreatorProgramAnalytics";
export type CreatorAnalyticsResponse = {
  totalFollowers?: number | null;
  activeEnrollments?: number | null;
  completionRate?: number | null;
  totalCompletions?: number | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  programs?: Array<CreatorProgramAnalytics> | null;
};
