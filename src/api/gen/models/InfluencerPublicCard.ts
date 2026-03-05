/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from "./Media";
import type { SocialLink } from "./SocialLink";
export type InfluencerPublicCard = {
  id: string;
  displayName: string;
  bio?: string;
  avatar?: Media;
  socialLinks?: Array<SocialLink>;
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
