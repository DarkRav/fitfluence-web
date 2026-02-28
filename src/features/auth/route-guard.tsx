"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/shared/ui";
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

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const requiredRole = resolveRequiredRole(pathname);
  const [isRedirectingToOnboarding, setIsRedirectingToOnboarding] = useState(false);

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && requiredRole && !auth.hasRole(requiredRole)) {
      router.replace("/forbidden");
    }
  }, [auth, requiredRole, router]);

  useEffect(() => {
    if (auth.status !== "authenticated") {
      setIsRedirectingToOnboarding(false);
      return;
    }

    const needsOnboarding =
      Boolean(auth.me?.onboarding.requiresInfluencerProfile) ||
      (Boolean(auth.me?.onboarding.requiresAthleteProfile) &&
        !Boolean(auth.me?.profiles.influencerProfileExists));

    if (needsOnboarding) {
      setIsRedirectingToOnboarding(true);
      router.replace("/onboarding");
      return;
    }

    setIsRedirectingToOnboarding(false);
  }, [
    auth.me?.profiles.influencerProfileExists,
    auth.me?.onboarding.requiresAthleteProfile,
    auth.me?.onboarding.requiresInfluencerProfile,
    auth.status,
    router,
  ]);

  if (auth.status !== "authenticated") {
    return <LoadingState title="Проверяем доступ..." />;
  }

  if (isRedirectingToOnboarding) {
    return <LoadingState title="Требуется завершить onboarding..." />;
  }

  if (requiredRole && !auth.hasRole(requiredRole)) {
    return <LoadingState title="Перенаправляем на страницу 403..." />;
  }

  return <>{children}</>;
}
