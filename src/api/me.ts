import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import { MeService, type MeResponse } from "@/api/gen";

configureOpenApiClient();

export type MeIdentity = {
  userId?: string;
  displayName?: string;
  email?: string;
  avatarMediaId?: string;
};

export type MeProfilesState = {
  athleteProfileExists: boolean;
  influencerProfileExists: boolean;
};

export type MeOnboardingState = {
  requiresAthleteProfile: boolean;
  requiresInfluencerProfile: boolean;
};

export type MeRecord = {
  identity: MeIdentity;
  roles: string[];
  profiles: MeProfilesState;
  onboarding: MeOnboardingState;
  // Compatibility fields for existing UI parts.
  userId?: string;
  displayName?: string;
  email?: string;
  avatarMediaId?: string;
};

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function asBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function mapMeResponse(raw: MeResponse): MeRecord {
  const root = asObject(raw) ?? {};
  const identitySource = asObject(root.identity);
  const profilesSource = asObject(root.profiles);
  const onboardingSource = asObject(root.onboarding);
  const athleteState = asObject(profilesSource?.athleteProfile);
  const influencerState = asObject(profilesSource?.influencerProfile);

  const identity = {
    userId:
      (typeof identitySource?.userId === "string" ? identitySource.userId : undefined) ??
      (typeof root.userId === "string" ? root.userId : undefined),
    displayName:
      (typeof identitySource?.displayName === "string" ? identitySource.displayName : undefined) ??
      (typeof root.displayName === "string" ? root.displayName : undefined),
    email:
      (typeof identitySource?.email === "string" ? identitySource.email : undefined) ??
      (typeof root.email === "string" ? root.email : undefined),
    avatarMediaId:
      (typeof identitySource?.avatarMediaId === "string"
        ? identitySource.avatarMediaId
        : undefined) ?? (typeof root.avatarMediaId === "string" ? root.avatarMediaId : undefined),
  };

  return {
    identity,
    roles: asStringArray(root.roles),
    profiles: {
      athleteProfileExists: asBoolean(athleteState?.exists),
      influencerProfileExists: asBoolean(influencerState?.exists),
    },
    onboarding: {
      requiresAthleteProfile: asBoolean(onboardingSource?.requiresAthleteProfile),
      requiresInfluencerProfile: asBoolean(onboardingSource?.requiresInfluencerProfile),
    },
    userId: identity.userId,
    displayName: identity.displayName,
    email: identity.email,
    avatarMediaId: identity.avatarMediaId,
  };
}

export async function getMe(): Promise<ApiResult<MeRecord>> {
  const result = await toApiResult(MeService.meGet());
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMeResponse(result.data),
  };
}
