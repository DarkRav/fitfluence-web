"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppButton, PageHeader, useAppToast } from "@/shared/ui";
import { resolveAuthReturnTo, resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const auth = useAuth();
  const { pushToast } = useAppToast();
  const returnTo = resolveAuthReturnTo(searchParams.get("returnTo"));

  useEffect(() => {
    if (auth.status === "authenticated" && auth.me) {
      router.replace(resolvePostLoginPath(auth.me, { returnTo }));
    }
  }, [auth.me, auth.status, returnTo, router]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await auth.signIn({ returnTo });
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
      await auth.signUp({ returnTo });
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
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
      <section className="grid w-full gap-6 rounded-2xl border border-border bg-card p-6 shadow-card md:grid-cols-[1.3fr_1fr] md:p-8">
        <div className="space-y-5">
          <PageHeader
            title="Вход в Fitfluence"
            subtitle="Сначала авторизуйтесь в защищённом аккаунте, затем продолжите работу в веб-приложении."
          />
          <div className="rounded-xl border border-border bg-sidebar/35 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Как это работает</p>
            <p className="mt-1">
              Вход и регистрация проходят в Keycloak. После подтверждения вы автоматически вернётесь
              в Fitfluence и увидите следующий шаг.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm font-medium text-foreground">Действия</p>
          <div className="mt-3 space-y-3">
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
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Если аккаунта нет, откроется регистрация Keycloak. После завершения вы вернётесь в
            onboarding.
          </p>
        </div>
      </section>
    </main>
  );
}
