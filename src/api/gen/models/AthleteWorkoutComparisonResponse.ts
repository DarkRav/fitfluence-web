/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AthletePersonalRecord } from "./AthletePersonalRecord";
export type AthleteWorkoutComparisonResponse = {
  workoutInstanceId?: string | null;
  previousWorkoutInstanceId?: string | null;
  durationSeconds?: number | null;
  totalSets?: number | null;
  totalReps?: number | null;
  volume?: number | null;
  repsDelta?: number | null;
  volumeDelta?: number | null;
  durationDeltaSeconds?: number | null;
  personalRecords?: Array<AthletePersonalRecord> | null;
  hasNewPersonalRecord?: boolean | null;
  deltaDurationSeconds?: number | null;
  deltaTotalReps?: number | null;
  deltaVolume?: number | null;
};
