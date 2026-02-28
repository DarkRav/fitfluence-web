import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProfilesService,
  type ContentMediaType,
  type CreateInfluencerProfileRequest,
  type InfluencerProfile,
  type SocialLink,
  type UpdateInfluencerProfileRequest,
} from "@/api/gen";

configureOpenApiClient();

export type InfluencerSocialLink = {
  type: string;
  url: string;
};

export type InfluencerProfileRecord = {
  userId: string;
  displayName?: string;
  bio?: string;
  avatarMediaId?: string;
  avatarUrl?: string;
  avatarType?: ContentMediaType;
  socialLinks: InfluencerSocialLink[];
  createdAt?: string;
  updatedAt?: string;
};

export type UpsertInfluencerProfilePayload = {
  displayName?: string;
  bio?: string;
  avatarMediaId?: string;
  socialLinks?: InfluencerSocialLink[];
};

export function isInfluencerProfileCreateSupported(): boolean {
  return typeof ProfilesService.influencerProfilePost === "function";
}

function resolveBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl && baseUrl.length > 0 ? baseUrl : "http://localhost:9876";
}

function resolveAvatarUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${resolveBaseUrl()}${normalizedPath}`;
}

function normalizeSocialLinks(links?: InfluencerSocialLink[]): SocialLink[] | undefined {
  if (!links || links.length === 0) {
    return undefined;
  }

  const normalized = links
    .map((item) => ({
      type: item.type.trim(),
      url: item.url.trim(),
    }))
    .filter((item) => item.type.length > 0 && item.url.length > 0);

  return normalized.length > 0 ? normalized : undefined;
}

function mapProfile(profile: InfluencerProfile): InfluencerProfileRecord {
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarMediaId: profile.avatar?.id,
    avatarUrl: resolveAvatarUrl(profile.avatar?.url),
    avatarType: profile.avatar?.type,
    socialLinks: profile.socialLinks ?? [],
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function normalizeCreatePayload(
  payload: UpsertInfluencerProfilePayload,
): CreateInfluencerProfileRequest {
  return {
    displayName: payload.displayName?.trim() || undefined,
    bio: payload.bio?.trim() || undefined,
    avatarMediaId: payload.avatarMediaId?.trim() || undefined,
    socialLinks: normalizeSocialLinks(payload.socialLinks),
  };
}

function normalizeUpdatePayload(
  payload: UpsertInfluencerProfilePayload,
): UpdateInfluencerProfileRequest {
  return {
    displayName: payload.displayName?.trim() || undefined,
    bio: payload.bio?.trim() || undefined,
    avatarMediaId: payload.avatarMediaId?.trim() || undefined,
    socialLinks: normalizeSocialLinks(payload.socialLinks),
  };
}

export async function getInfluencerProfile(): Promise<ApiResult<InfluencerProfileRecord>> {
  const result = await toApiResult(ProfilesService.influencerProfileGet());
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProfile(result.data),
  };
}

export async function createInfluencerProfile(
  payload: UpsertInfluencerProfilePayload,
): Promise<ApiResult<InfluencerProfileRecord>> {
  if (!isInfluencerProfileCreateSupported()) {
    return {
      ok: false,
      error: {
        kind: "validation",
        message: "Создание профиля инфлюэнсера не поддержано сервером",
      },
    };
  }

  const result = await toApiResult(
    ProfilesService.influencerProfilePost({
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProfile(result.data),
  };
}

export async function updateInfluencerProfile(
  payload: UpsertInfluencerProfilePayload,
): Promise<ApiResult<InfluencerProfileRecord>> {
  const result = await toApiResult(
    ProfilesService.influencerProfilePatch({
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapProfile(result.data),
  };
}
