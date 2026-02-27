/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgressionPolicyOwnerType } from "./ProgressionPolicyOwnerType";
import type { ProgressionPolicyStatus } from "./ProgressionPolicyStatus";
import type { ProgressionPolicyType } from "./ProgressionPolicyType";
export type CreateProgressionPolicyRequest = {
  code: string;
  name: string;
  description?: string;
  type: ProgressionPolicyType;
  params?: Record<string, any>;
  status?: ProgressionPolicyStatus;
  ownerType?: ProgressionPolicyOwnerType;
  ownerId?: string;
};
