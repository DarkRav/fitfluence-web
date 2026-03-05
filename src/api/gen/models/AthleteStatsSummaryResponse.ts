/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AthleteLastWorkoutSummary } from "./AthleteLastWorkoutSummary";
export type AthleteStatsSummaryResponse = {
  streakDays: number;
  workouts7d: number;
  totalWorkouts: number;
  totalMinutes7d?: number | null;
  lastWorkoutAt?: string | null;
  lastWorkout?: AthleteLastWorkoutSummary | null;
};
