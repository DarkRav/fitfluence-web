"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getInfluencerProfile } from "@/api/influencerProfile";
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
  const isInfluencerSection = pathname.startsWith("/influencer");
  const isInfluencerProfilePage = pathname.startsWith("/influencer/profile");
  const [isCheckingInfluencerProfile, setIsCheckingInfluencerProfile] = useState(false);

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
    let isCancelled = false;

    if (
      auth.status !== "authenticated" ||
      !auth.hasRole("INFLUENCER") ||
      !isInfluencerSection ||
      isInfluencerProfilePage
    ) {
      setIsCheckingInfluencerProfile(false);
      return () => {
        isCancelled = true;
      };
    }

    setIsCheckingInfluencerProfile(true);

    void getInfluencerProfile().then((result) => {
      if (isCancelled) {
        return;
      }

      if (!result.ok && result.error.kind === "not_found") {
        const returnTo = encodeURIComponent(pathname);
        router.replace(`/influencer/profile?onboarding=1&returnTo=${returnTo}`);
        return;
      }

      setIsCheckingInfluencerProfile(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [auth, isInfluencerProfilePage, isInfluencerSection, pathname, router]);

  if (auth.status !== "authenticated") {
    return <LoadingState title="Проверяем доступ..." />;
  }

  if (isCheckingInfluencerProfile) {
    return <LoadingState title="Проверяем профиль инфлюэнсера..." />;
  }

  if (requiredRole && !auth.hasRole(requiredRole)) {
    return <LoadingState title="Перенаправляем на страницу 403..." />;
  }

  return <>{children}</>;
}
