/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InfluencerBrief } from "./InfluencerBrief";
import type { Media } from "./Media";
import type { ProgramStatus } from "./ProgramStatus";
import type { ProgramVersionSummary } from "./ProgramVersionSummary";
export type ProgramListItem = {
  id: string;
  title: string;
  description?: string;
  status: ProgramStatus;
  isFeatured?: boolean;
  influencer?: InfluencerBrief;
  cover?: Media;
  media?: Array<Media>;
  goals?: Array<string>;
  currentPublishedVersion?: ProgramVersionSummary;
  createdAt?: string;
  updatedAt?: string;
};
