/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgramStatus } from "./ProgramStatus";
export type UpdateProgramRequest = {
  title?: string;
  description?: string;
  goals?: Array<string>;
  mediaIds?: Array<string>;
  status?: ProgramStatus;
  currentPublishedVersionId?: string;
};
