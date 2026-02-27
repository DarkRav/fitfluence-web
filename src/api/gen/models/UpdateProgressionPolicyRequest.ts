/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgressionPolicyStatus } from "./ProgressionPolicyStatus";
import type { ProgressionPolicyType } from "./ProgressionPolicyType";
export type UpdateProgressionPolicyRequest = {
  code?: string;
  name?: string;
  description?: string;
  type?: ProgressionPolicyType;
  params?: Record<string, any>;
  status?: ProgressionPolicyStatus;
};
