"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, PageHeader } from "@/shared/ui";
import { resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();
  const { completeSignIn } = auth;
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const complete = async () => {
      try {
        const result = await completeSignIn();
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
  }, [completeSignIn, router]);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <PageHeader title="Завершение входа" subtitle="Завершаем OIDC-авторизацию." />
      <LoadingState title="Проверяем токены и роли..." />
    </main>
  );
}
