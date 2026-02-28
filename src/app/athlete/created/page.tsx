"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader } from "@/shared/ui";
import { resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function AthleteCreatedPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me) {
      const nextPath = resolvePostLoginPath(auth.me);
      if (nextPath !== "/athlete/created") {
        router.replace(nextPath);
      }
    }
  }, [auth.me, auth.status, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
        <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
          <PageHeader title="Загрузка" subtitle="Проверяем авторизацию..." />
        </section>
      </main>
    );
  }

  const loginLabel = auth.me?.identity.email ?? auth.me?.identity.userId ?? "не определен";

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Профиль атлета создан"
          subtitle="Для тренировок используйте мобильное приложение Fitfluence."
        />

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Вы вошли как <span className="font-medium text-foreground">{loginLabel}</span>.
          </p>
          <p>Веб-интерфейс атлета пока недоступен.</p>
          <p>Вы можете выйти из аккаунта или создать профиль инфлюэнсера для работы в web-admin.</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {!auth.me?.profiles.influencerProfileExists ? (
            <AppButton asChild variant="secondary">
              <Link href="/onboarding/influencer">Создать профиль инфлюэнсера</Link>
            </AppButton>
          ) : null}
          <AppButton type="button" variant="secondary" onClick={() => void auth.logout()}>
            Выйти
          </AppButton>
        </div>
      </section>
    </main>
  );
}
