/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InfluencerBrief } from "./InfluencerBrief";
import type { Media } from "./Media";
import type { ProgramStatus } from "./ProgramStatus";
import type { ProgramVersionSummary } from "./ProgramVersionSummary";
export type ProgramListItem = {
  id: string;
  title: string;
  description?: string;
  status: ProgramStatus;
  isFeatured?: boolean;
  influencer?: InfluencerBrief;
  cover?: Media;
  media?: Array<Media>;
  goals?: Array<string>;
  currentPublishedVersion?: ProgramVersionSummary;
  /**
   * Уровень программы (optional enrichment field).
   */
  level?: string;
  /**
   * Количество тренировочных дней в неделю (optional enrichment field).
   */
  daysPerWeek?: number;
  /**
   * Оценка длительности одной тренировки в минутах (optional enrichment field).
   */
  estimatedDurationMinutes?: number;
  /**
   * Агрегированный список требуемого оборудования (optional enrichment field).
   */
  equipment?: Array<string>;
  createdAt?: string;
  updatedAt?: string;
};
