"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMe } from "@/api/me";
import type { MeRecord } from "@/api/me";
import { setApiAccessToken } from "@/api/auth-token";
import { oidcUserManager } from "@/features/auth/oidc";
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

const SIGNIN_RETURN_TO_KEY = "fitfluence:signin:returnTo";
const SIGNUP_RETURN_TO_KEY = "fitfluence:signup:returnTo";

function persistReturnTo(key: string, value?: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.sessionStorage.setItem(key, value);
    return;
  }

  window.sessionStorage.removeItem(key);
}

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
    let user = await oidcUserManager.getUser();

    if (user?.access_token && user.expired) {
      try {
        user = await oidcUserManager.signinSilent();
      } catch {
        user = null;
      }
    }

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
    persistReturnTo(SIGNIN_RETURN_TO_KEY, options?.returnTo ?? null);
    await oidcUserManager.signinRedirect({
      state: {
        returnTo: options?.returnTo ?? null,
      },
    });
  }, []);

  const signUp = useCallback(async (options?: { returnTo?: string | null }) => {
    persistReturnTo(SIGNUP_RETURN_TO_KEY, options?.returnTo ?? null);

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
    let user;
    try {
      user = await oidcUserManager.signinRedirectCallback();
    } catch (callbackError) {
      const fallbackUser = await oidcUserManager.getUser();
      if (!fallbackUser?.access_token || fallbackUser.expired) {
        throw callbackError;
      }
      user = fallbackUser;
    }

    const callbackState =
      user.state && typeof user.state === "object" ? (user.state as Record<string, unknown>) : null;
    let returnTo =
      callbackState && typeof callbackState.returnTo === "string" ? callbackState.returnTo : null;
    if (!returnTo && typeof window !== "undefined") {
      returnTo =
        window.sessionStorage.getItem(SIGNIN_RETURN_TO_KEY) ??
        window.sessionStorage.getItem(SIGNUP_RETURN_TO_KEY);
    }
    persistReturnTo(SIGNIN_RETURN_TO_KEY, null);
    persistReturnTo(SIGNUP_RETURN_TO_KEY, null);
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
    persistReturnTo(SIGNIN_RETURN_TO_KEY, null);
    persistReturnTo(SIGNUP_RETURN_TO_KEY, null);

    try {
      await oidcUserManager.signoutRedirect();
      return;
    } catch {
      try {
        await oidcUserManager.removeUser();
        await oidcUserManager.clearStaleState();
      } catch {
        // Ignore cleanup failures and proceed with local logout state.
      }

      setApiAccessToken(null);
      setState({
        status: "anonymous",
        accessToken: null,
        me: null,
        roles: [],
      });

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
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
