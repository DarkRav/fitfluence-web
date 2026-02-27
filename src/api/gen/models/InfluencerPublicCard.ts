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
};
