"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

function resolveLandingPath(
  roles: string[],
  profiles?: {
    athleteProfileExists: boolean;
    influencerProfileExists: boolean;
  },
): string {
  void roles;
  void profiles;
  return "/me";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const complete = async () => {
      try {
        const result = await auth.completeSignIn();
        router.replace(
          resolveLandingPath(result.roles, {
            athleteProfileExists: result.athleteProfileExists,
            influencerProfileExists: result.influencerProfileExists,
          }),
        );
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
