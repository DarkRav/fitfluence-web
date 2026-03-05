/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InfluencerProgramAnalyticsFunnelResponse = {
  programId: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  /**
   * program_view шаг. При отсутствии view-tracking равен program_start.
   */
  programView: number;
  /**
   * Количество starts (enrollments) за период.
   */
  programStart: number;
  firstWorkoutStart: number;
  firstWorkoutComplete: number;
  completion: number;
};
