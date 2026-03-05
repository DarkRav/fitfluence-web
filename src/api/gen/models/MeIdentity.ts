/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from "./Media";
export type MeIdentity = {
  /**
   * Stable subject from OIDC access token.
   */
  sub: string;
  /**
   * preferred_username, fallback to email.
   */
  username?: string;
  email?: string;
  /**
   * name, fallback to given_name + family_name, then username.
   */
  displayName?: string;
  avatarMediaId?: string | null;
  avatar?: Media | null;
};
