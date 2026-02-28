"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader, useAppToast } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const auth = useAuth();
  const { pushToast } = useAppToast();

  useEffect(() => {
    if (auth.status === "authenticated") {
      if (
        auth.me?.onboarding.requiresInfluencerProfile ||
        auth.me?.onboarding.requiresAthleteProfile
      ) {
        router.replace("/onboarding");
        return;
      }
      if (auth.hasRole("ADMIN")) {
        router.replace("/admin/programs");
        return;
      }
      if (auth.hasRole("INFLUENCER")) {
        router.replace("/influencer/programs");
        return;
      }
      if (auth.hasRole("ATHLETE")) {
        router.replace("/athlete");
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

  const onRegister = async () => {
    setIsRegisterLoading(true);
    try {
      await auth.signUp();
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Не удалось открыть регистрацию",
        description:
          error instanceof Error
            ? error.message
            : "Проверьте OIDC-настройки и страницу регистрации Keycloak",
      });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-card">
        <PageHeader title="Вход" subtitle="Авторизация через корпоративный Keycloak." />
        <div className="space-y-4">
          <AppButton className="w-full" type="button" disabled={isLoading} onClick={onSubmit}>
            {isLoading ? "Перенаправляем..." : "Войти"}
          </AppButton>
          <AppButton
            className="w-full"
            type="button"
            variant="secondary"
            disabled={isRegisterLoading}
            onClick={onRegister}
          >
            {isRegisterLoading ? "Открываем регистрацию..." : "Создать аккаунт"}
          </AppButton>
          <p className="text-center text-xs text-muted-foreground">
            Регистрация выполняется на стороне Keycloak.
            <span className="ml-1">Кнопка открывает страницу создания аккаунта.</span>
          </p>
        </div>
      </section>
    </main>
  );
}
