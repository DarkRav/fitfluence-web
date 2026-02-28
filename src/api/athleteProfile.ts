import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProfilesService,
  type AthleteProfile,
  type CreateAthleteProfileRequest,
  type UpdateAthleteProfileRequest,
} from "@/api/gen";

configureOpenApiClient();

export type AthleteProfileRecord = {
  userId: string;
  goals: string[];
  level?: string;
  heightCm?: number;
  weightKg?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UpsertAthleteProfilePayload = CreateAthleteProfileRequest;

function mapAthleteProfile(profile: AthleteProfile): AthleteProfileRecord {
  return {
    userId: profile.userId,
    goals: profile.goals ?? [],
    level: profile.level,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export async function getAthleteProfile(): Promise<ApiResult<AthleteProfileRecord>> {
  const result = await toApiResult(ProfilesService.athleteProfileGet());
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapAthleteProfile(result.data),
  };
}

export async function createAthleteProfile(
  payload: UpsertAthleteProfilePayload,
): Promise<ApiResult<AthleteProfileRecord>> {
  const result = await toApiResult(
    ProfilesService.athleteProfilePost({
      requestBody: payload,
    }),
  );
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapAthleteProfile(result.data),
  };
}

export async function updateAthleteProfile(
  payload: UpdateAthleteProfileRequest,
): Promise<ApiResult<AthleteProfileRecord>> {
  const result = await toApiResult(
    ProfilesService.athleteProfilePatch({
      requestBody: payload,
    }),
  );
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapAthleteProfile(result.data),
  };
}
