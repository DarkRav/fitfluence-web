"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, PageHeader } from "@/shared/ui";
import { resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const complete = async () => {
      try {
        const result = await auth.completeSignIn();
        if (!result.me) {
          router.replace("/login");
          return;
        }

        router.replace(resolvePostLoginPath(result.me, { returnTo: result.returnTo }));
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
