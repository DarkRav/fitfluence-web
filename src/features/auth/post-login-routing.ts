import type { MeRecord } from "@/api/me";

const ATHLETE_WEB_UI_AVAILABLE = false;

type OnboardingFlags = {
  requiresAthleteProfile: boolean;
  requiresInfluencerProfile: boolean;
};

function asSafeInternalPath(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  if (value.startsWith("/login") || value.startsWith("/auth/")) {
    return null;
  }

  return value;
}

function canAccessPath(me: MeRecord, path: string): boolean {
  if (path.startsWith("/admin")) {
    return me.roles.includes("ADMIN");
  }

  if (path.startsWith("/influencer")) {
    return me.roles.includes("INFLUENCER") || me.profiles.influencerProfileExists;
  }

  if (path.startsWith("/athlete")) {
    return me.roles.includes("ATHLETE") || me.profiles.athleteProfileExists;
  }

  return false;
}

function withReturnTo(path: string, returnTo?: string | null): string {
  const safeReturnTo = asSafeInternalPath(returnTo);
  if (!safeReturnTo) {
    return path;
  }

  const query = new URLSearchParams({ returnTo: safeReturnTo });
  return `${path}?${query.toString()}`;
}

export function resolveRoleHomePath(me: MeRecord): string {
  if (me.roles.includes("ADMIN")) {
    return "/admin/programs";
  }

  if (me.roles.includes("INFLUENCER")) {
    return "/influencer/programs";
  }

  if (me.roles.includes("ATHLETE") || me.profiles.athleteProfileExists) {
    return ATHLETE_WEB_UI_AVAILABLE ? "/athlete/catalog" : "/athlete/created";
  }

  if (me.profiles.influencerProfileExists) {
    return "/welcome";
  }

  return "/onboarding";
}

export function resolveOnboardingEntryPath(
  me: MeRecord,
  options?: {
    returnTo?: string | null;
    manualChoice?: boolean;
  },
): string {
  const onboarding: OnboardingFlags = me.onboarding;
  const noProfiles = !me.profiles.athleteProfileExists && !me.profiles.influencerProfileExists;
  const hasInfluencerAccess =
    me.roles.includes("INFLUENCER") || me.profiles.influencerProfileExists;
  const hasAdminAccess = me.roles.includes("ADMIN");

  if (onboarding.requiresInfluencerProfile && !onboarding.requiresAthleteProfile) {
    return withReturnTo("/onboarding/influencer", options?.returnTo);
  }

  if (onboarding.requiresAthleteProfile && !onboarding.requiresInfluencerProfile) {
    if (hasInfluencerAccess || hasAdminAccess) {
      return resolveRoleHomePath(me);
    }
    return withReturnTo("/onboarding/athlete", options?.returnTo);
  }

  if (onboarding.requiresInfluencerProfile) {
    return withReturnTo("/onboarding/influencer", options?.returnTo);
  }

  if (onboarding.requiresAthleteProfile && !(hasInfluencerAccess || hasAdminAccess)) {
    return withReturnTo("/onboarding/athlete", options?.returnTo);
  }

  if (noProfiles) {
    return withReturnTo("/onboarding", options?.returnTo);
  }

  if (options?.manualChoice) {
    return withReturnTo("/onboarding", options.returnTo);
  }

  return resolveRoleHomePath(me);
}

export function resolvePostLoginPath(
  me: MeRecord,
  options?: {
    returnTo?: string | null;
  },
): string {
  const onboardingPath = resolveOnboardingEntryPath(me, options);
  if (onboardingPath.startsWith("/onboarding")) {
    return onboardingPath;
  }

  const safeReturnTo = asSafeInternalPath(options?.returnTo);
  if (safeReturnTo && canAccessPath(me, safeReturnTo)) {
    return safeReturnTo;
  }

  return resolveRoleHomePath(me);
}

export function resolveAuthReturnTo(returnTo?: string | null): string | null {
  return asSafeInternalPath(returnTo);
}
