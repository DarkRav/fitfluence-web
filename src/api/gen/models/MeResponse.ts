/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeIdentity } from "./MeIdentity";
import type { MeOnboarding } from "./MeOnboarding";
import type { MeProfiles } from "./MeProfiles";
export type MeResponse = {
  identity: MeIdentity;
  roles: Array<string>;
  profiles: MeProfiles;
  onboarding: MeOnboarding;
};
