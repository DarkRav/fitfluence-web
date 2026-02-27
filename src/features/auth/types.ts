import type { MeResponse } from "@/api/gen";

export type AppRole = "ADMIN" | "INFLUENCER" | "ATHLETE" | string;

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  me: MeResponse | null;
  roles: AppRole[];
};
