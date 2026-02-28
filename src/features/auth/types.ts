import type { MeRecord } from "@/api/me";

export type AppRole = "ADMIN" | "INFLUENCER" | "ATHLETE" | string;

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  me: MeRecord | null;
  roles: AppRole[];
};
