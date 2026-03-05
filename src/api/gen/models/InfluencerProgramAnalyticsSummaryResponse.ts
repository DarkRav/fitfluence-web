/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InfluencerProgramAnalyticsSummaryResponse = {
  programId: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  /**
   * Количество просмотров программы (если трекинга просмотров нет, возвращается количество starts).
   */
  views: number;
  /**
   * Количество starts/enrollments за период.
   */
  enrollments: number;
  /**
   * Количество активных атлетов по enrollments в периоде.
   */
  activeAthletes: number;
  /**
   * Количество завершений программы (по статусу enrollment).
   */
  completions: number;
  /**
   * Доля completions от enrollments в диапазоне [0,1].
   */
  completionRate: number;
  /**
   * Week-1 retention (nullable на этапе каркаса).
   */
  week1Retention?: number | null;
  /**
   * Week-4 retention (nullable на этапе каркаса).
   */
  week4Retention?: number | null;
};
