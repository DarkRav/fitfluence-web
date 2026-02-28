"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

function resolveLandingPath(roles: string[]): string {
  if (roles.includes("ADMIN")) {
    return "/admin";
  }

  if (roles.includes("INFLUENCER")) {
    return "/influencer/programs";
  }

  if (roles.includes("ATHLETE")) {
    return "/athlete";
  }

  return "/forbidden";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const complete = async () => {
      try {
        const result = await auth.completeSignIn();
        if (result.requiresInfluencerProfile || result.requiresAthleteProfile) {
          router.replace("/onboarding");
          return;
        }

        router.replace(resolveLandingPath(result.roles));
      } catch {
        router.replace("/login");
      }
    };

    void complete();
  }, [auth, router]);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <PageHeader title="Завершение входа" subtitle="Завершаем OIDC-авторизацию." />
      <LoadingState title="Проверяем токены и роли..." />
    </main>
  );
}
