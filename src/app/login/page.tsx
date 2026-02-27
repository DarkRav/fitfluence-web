"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader, useAppToast } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { pushToast } = useAppToast();

  useEffect(() => {
    if (auth.status === "authenticated") {
      if (auth.hasRole("ADMIN")) {
        router.replace("/admin");
        return;
      }
      if (auth.hasRole("INFLUENCER")) {
        router.replace("/influencer");
        return;
      }
      router.replace("/forbidden");
    }
  }, [auth, router]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await auth.signIn();
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Не удалось перейти на Keycloak",
        description: error instanceof Error ? error.message : "Проверьте OIDC настройки клиента",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-card">
        <PageHeader title="Вход" subtitle="Авторизация через корпоративный Keycloak." />
        <div className="space-y-4">
          <AppButton className="w-full" type="button" disabled={isLoading} onClick={onSubmit}>
            {isLoading ? "Перенаправляем..." : "Sign in"}
          </AppButton>
        </div>
      </section>
    </main>
  );
}
