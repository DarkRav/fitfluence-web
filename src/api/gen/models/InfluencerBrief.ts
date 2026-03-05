/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from "./Media";
export type InfluencerBrief = {
  id: string;
  displayName: string;
  avatar?: Media;
  bio?: string;
  /**
   * Количество подписчиков инфлюэнсера.
   */
  followersCount?: number;
  /**
   * Количество опубликованных программ инфлюэнсера.
   */
  programsCount?: number | null;
  /**
   * Признак подписки текущего пользователя-атлета.
   * Для неаутентифицированных запросов и пользователей без athleteProfile всегда возвращается false.
   *
   */
  isFollowedByMe?: boolean;
};
