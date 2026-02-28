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
  me: { profiles: { influencerProfileExists: boolean } } | null,
): boolean {
  if (!requiredRole) {
    return true;
  }

  if (requiredRole === "ADMIN") {
    return hasRole("ADMIN");
  }

  return hasRole("INFLUENCER") || Boolean(me?.profiles.influencerProfileExists);
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { status, me, hasRole } = auth;
  const requiredRole = resolveRequiredRole(pathname);
  const [isRedirectingToOnboarding, setIsRedirectingToOnboarding] = useState(false);

  useEffect(() => {
    if (status === "anonymous") {
      const query = new URLSearchParams({ returnTo: pathname });
      router.replace(`/login?${query.toString()}`);
      return;
    }

    if (status === "authenticated" && !hasAccessForRequiredRole(requiredRole, hasRole, me)) {
      router.replace("/forbidden");
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

    const onboardingPath = resolveOnboardingEntryPath(me, { returnTo: pathname });
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

  if (!hasAccessForRequiredRole(requiredRole, hasRole, me)) {
    return <LoadingState title="Перенаправляем на страницу 403..." />;
  }

  return <>{children}</>;
}
