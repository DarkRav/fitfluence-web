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
    return "/influencer";
  }

  return "/forbidden";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const complete = async () => {
      try {
        const roles = await auth.completeSignIn();
        const path = resolveLandingPath(roles);
        router.replace(path);
      } catch {
        router.replace("/login");
      }
    };

    void complete();
  }, [auth, router]);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <PageHeader title="Auth callback" subtitle="Завершаем OIDC авторизацию." />
      <LoadingState title="Проверяем токены и роли..." />
    </main>
  );
}
