"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMe } from "@/api/me";
import { setApiAccessToken } from "@/api/auth-token";
import { buildRegistrationUrl, oidcUserManager } from "@/features/auth/oidc";
import { normalizeRoles } from "@/features/auth/roles";
import type { AuthState, AppRole } from "@/features/auth/types";

type AuthContextValue = AuthState & {
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  completeSignIn: () => Promise<{
    roles: AppRole[];
    requiresAthleteProfile: boolean;
    requiresInfluencerProfile: boolean;
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

  const signIn = useCallback(async () => {
    await oidcUserManager.signinRedirect();
  }, []);

  const signUp = useCallback(async () => {
    const useKcActionRegister = process.env.NEXT_PUBLIC_OIDC_USE_KC_ACTION_REGISTER === "true";
    if (useKcActionRegister) {
      await oidcUserManager.signinRedirect({
        extraQueryParams: {
          kc_action: "register",
        },
      });
      return;
    }

    const registrationUrl = buildRegistrationUrl();
    if (registrationUrl && typeof window !== "undefined") {
      window.location.assign(registrationUrl);
      return;
    }

    await oidcUserManager.signinRedirect();
  }, []);

  const completeSignIn = useCallback(async () => {
    const user = await oidcUserManager.signinRedirectCallback();
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
        requiresAthleteProfile: false,
        requiresInfluencerProfile: false,
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
      requiresAthleteProfile: meResult.data.onboarding.requiresAthleteProfile,
      requiresInfluencerProfile: meResult.data.onboarding.requiresInfluencerProfile,
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
