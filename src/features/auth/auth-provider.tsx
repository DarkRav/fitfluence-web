"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMe } from "@/api/me";
import type { MeRecord } from "@/api/me";
import { setApiAccessToken } from "@/api/auth-token";
import { buildRegistrationUrl, oidcUserManager } from "@/features/auth/oidc";
import { normalizeRoles } from "@/features/auth/roles";
import type { AuthState, AppRole } from "@/features/auth/types";

type AuthContextValue = AuthState & {
  signIn: (options?: { returnTo?: string | null }) => Promise<void>;
  signUp: (options?: { returnTo?: string | null }) => Promise<void>;
  completeSignIn: () => Promise<{
    roles: AppRole[];
    me: MeRecord | null;
    returnTo: string | null;
    requiresAthleteProfile: boolean;
    requiresInfluencerProfile: boolean;
    athleteProfileExists: boolean;
    influencerProfileExists: boolean;
  }>;
  logout: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  refreshMe: () => Promise<void>;
};

const initialState: AuthState = {
  status: "loading",
  accessToken: null,
  me: null,
  roles: [],
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const SIGNUP_RETURN_TO_KEY = "fitfluence:signup:returnTo";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const refreshMe = useCallback(async () => {
    const meResult = await getMe();

    if (meResult.ok) {
      const roles = normalizeRoles(meResult.data.roles);
      setState((prev) => ({
        ...prev,
        status: "authenticated",
        me: meResult.data,
        roles,
      }));
      return;
    }

    setState({
      status: "anonymous",
      accessToken: null,
      me: null,
      roles: [],
    });
  }, []);

  const loadUser = useCallback(async () => {
    const user = await oidcUserManager.getUser();

    if (!user?.access_token || user.expired) {
      setApiAccessToken(null);
      setState({
        status: "anonymous",
        accessToken: null,
        me: null,
        roles: [],
      });
      return;
    }

    setApiAccessToken(user.access_token);
    setState((prev) => ({
      ...prev,
      accessToken: user.access_token,
      status: "loading",
    }));
    await refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const signIn = useCallback(async (options?: { returnTo?: string | null }) => {
    await oidcUserManager.signinRedirect({
      state: {
        returnTo: options?.returnTo ?? null,
      },
    });
  }, []);

  const signUp = useCallback(async (options?: { returnTo?: string | null }) => {
    const registrationUrl = buildRegistrationUrl();
    if (registrationUrl && typeof window !== "undefined") {
      if (options?.returnTo) {
        window.sessionStorage.setItem(SIGNUP_RETURN_TO_KEY, options.returnTo);
      } else {
        window.sessionStorage.removeItem(SIGNUP_RETURN_TO_KEY);
      }
      window.location.assign(registrationUrl);
      return;
    }

    await oidcUserManager.signinRedirect({
      extraQueryParams: {
        kc_action: "register",
      },
      state: {
        returnTo: options?.returnTo ?? null,
      },
    });
  }, []);

  const completeSignIn = useCallback(async () => {
    const user = await oidcUserManager.signinRedirectCallback();
    const callbackState =
      user.state && typeof user.state === "object" ? (user.state as Record<string, unknown>) : null;
    let returnTo =
      callbackState && typeof callbackState.returnTo === "string" ? callbackState.returnTo : null;
    if (!returnTo && typeof window !== "undefined") {
      returnTo = window.sessionStorage.getItem(SIGNUP_RETURN_TO_KEY);
      window.sessionStorage.removeItem(SIGNUP_RETURN_TO_KEY);
    }
    setApiAccessToken(user.access_token);
    setState((prev) => ({
      ...prev,
      accessToken: user.access_token,
      status: "loading",
    }));
    const meResult = await getMe();
    if (!meResult.ok) {
      setState({
        status: "anonymous",
        accessToken: null,
        me: null,
        roles: [],
      });
      return {
        roles: [],
        me: null,
        returnTo,
        requiresAthleteProfile: false,
        requiresInfluencerProfile: false,
        athleteProfileExists: false,
        influencerProfileExists: false,
      };
    }

    const roles = normalizeRoles(meResult.data.roles);
    setState((prev) => ({
      ...prev,
      status: "authenticated",
      me: meResult.data,
      roles,
    }));
    return {
      roles,
      me: meResult.data,
      returnTo,
      requiresAthleteProfile: meResult.data.onboarding.requiresAthleteProfile,
      requiresInfluencerProfile: meResult.data.onboarding.requiresInfluencerProfile,
      athleteProfileExists: meResult.data.profiles.athleteProfileExists,
      influencerProfileExists: meResult.data.profiles.influencerProfileExists,
    };
  }, []);

  const logout = useCallback(async () => {
    setApiAccessToken(null);
    setState({
      status: "anonymous",
      accessToken: null,
      me: null,
      roles: [],
    });
    await oidcUserManager.signoutRedirect();
  }, []);

  const hasRole = useCallback((role: AppRole) => state.roles.includes(role), [state.roles]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signUp,
      completeSignIn,
      logout,
      hasRole,
      refreshMe,
    }),
    [state, signIn, signUp, completeSignIn, logout, hasRole, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
