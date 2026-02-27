import type { AppRole } from "@/features/auth/types";

export const ROLE_ADMIN = "ADMIN" as const;
export const ROLE_INFLUENCER = "INFLUENCER" as const;
export const ROLE_ATHLETE = "ATHLETE" as const;

export function normalizeRole(role: string): AppRole {
  const trimmed = role.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/^ROLE_/i, "").toUpperCase();
}

export function normalizeRoles(roles: string[]): AppRole[] {
  const normalized = roles.map(normalizeRole).filter((role): role is AppRole => role.length > 0);
  return Array.from(new Set(normalized));
}
