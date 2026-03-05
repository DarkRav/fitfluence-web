/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AthleteSyncStatus } from "./AthleteSyncStatus";
export type AthleteSyncStatusResponse = {
  status: AthleteSyncStatus;
  hasPendingLocalChanges?: boolean | null;
  isDelayed?: boolean | null;
  pendingOperations?: number | null;
  lastSyncedAt?: string | null;
};
