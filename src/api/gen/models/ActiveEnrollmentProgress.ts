/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkoutInstanceStatus } from "./WorkoutInstanceStatus";
/**
 * Прогресс по активной программе текущего атлета.
 */
export type ActiveEnrollmentProgress = {
  enrollmentId?: string | null;
  status?: string | null;
  programId?: string | null;
  programTitle?: string | null;
  programVersionId?: string | null;
  currentWorkoutId?: string | null;
  currentWorkoutTitle?: string | null;
  currentWorkoutStatus?: WorkoutInstanceStatus | null;
  /**
   * ID следующей запланированной тренировки (workout_instance.id), использовать для `/v1/athlete/workouts/{workoutInstanceId}/start`.
   */
  nextWorkoutId?: string | null;
  nextWorkoutTitle?: string | null;
  nextWorkoutStatus?: WorkoutInstanceStatus | null;
  completedSessions?: number | null;
  totalSessions?: number | null;
  completionPercent?: number | null;
  lastCompletedAt?: string | null;
  updatedAt?: string | null;
};
