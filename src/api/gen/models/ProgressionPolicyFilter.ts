/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProgressionPolicyOwnerType } from "./ProgressionPolicyOwnerType";
import type { ProgressionPolicyStatus } from "./ProgressionPolicyStatus";
import type { ProgressionPolicyType } from "./ProgressionPolicyType";
export type ProgressionPolicyFilter = {
  search?: string;
  type?: ProgressionPolicyType;
  status?: ProgressionPolicyStatus;
  ownerType?: ProgressionPolicyOwnerType;
};
