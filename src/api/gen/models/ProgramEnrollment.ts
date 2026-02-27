/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrollmentStatus } from "./EnrollmentStatus";
export type ProgramEnrollment = {
  id: string;
  athleteId: string;
  programVersionId: string;
  status: EnrollmentStatus;
  startedAt: string;
  createdAt?: string;
  updatedAt?: string;
};
