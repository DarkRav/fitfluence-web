"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/shared/ui";
import { resolveOnboardingEntryPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

function resolveRequiredRole(pathname: string): "ADMIN" | "INFLUENCER" | null {
  if (pathname.startsWith("/admin")) {
    return "ADMIN";
  }

  if (pathname.startsWith("/influencer")) {
    return "INFLUENCER";
  }

  return null;
}

function hasAccessForRequiredRole(
  requiredRole: "ADMIN" | "INFLUENCER" | null,
  hasRole: (role: "ADMIN" | "INFLUENCER") => boolean,
): boolean {
  if (!requiredRole) {
    return true;
  }

  return hasRole(requiredRole);
}

function resolveDeniedPath(
  requiredRole: "ADMIN" | "INFLUENCER" | null,
  me: { profiles: { influencerProfileExists: boolean } } | null,
): string {
  if (requiredRole === "INFLUENCER" && me?.profiles.influencerProfileExists) {
    return "/welcome";
  }

  return "/forbidden";
}

function resolveReturnTo(pathname: string): string {
  if (typeof window === "undefined") {
    return pathname;
  }

  const query = window.location.search;
  return query ? `${pathname}${query}` : pathname;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { status, me, hasRole } = auth;
  const requiredRole = resolveRequiredRole(pathname);
  const [isRedirectingToOnboarding, setIsRedirectingToOnboarding] = useState(false);

  useEffect(() => {
    const returnTo = resolveReturnTo(pathname);
    if (status === "anonymous") {
      const query = new URLSearchParams({ returnTo });
      router.replace(`/login?${query.toString()}`);
      return;
    }

    if (status === "authenticated" && !hasAccessForRequiredRole(requiredRole, hasRole)) {
      router.replace(resolveDeniedPath(requiredRole, me));
    }
  }, [hasRole, me, pathname, requiredRole, router, status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsRedirectingToOnboarding(false);
      return;
    }

    if (!me) {
      setIsRedirectingToOnboarding(false);
      return;
    }

    const returnTo = resolveReturnTo(pathname);
    const onboardingPath = resolveOnboardingEntryPath(me, { returnTo });
    if (onboardingPath.startsWith("/onboarding")) {
      setIsRedirectingToOnboarding(true);
      router.replace(onboardingPath);
      return;
    }

    setIsRedirectingToOnboarding(false);
  }, [me, pathname, router, status]);

  if (status !== "authenticated") {
    return <LoadingState title="Проверяем доступ..." />;
  }

  if (isRedirectingToOnboarding) {
    return <LoadingState title="Требуется завершить onboarding..." />;
  }

  if (!hasAccessForRequiredRole(requiredRole, hasRole)) {
    return <LoadingState title="Проверяем права доступа..." />;
  }

  return <>{children}</>;
}
