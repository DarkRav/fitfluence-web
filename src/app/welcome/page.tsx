"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function WelcomePage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status !== "authenticated" || !auth.me) {
      return;
    }

    if (auth.me.onboarding.requiresAthleteProfile || auth.me.onboarding.requiresInfluencerProfile) {
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

    if (auth.hasRole("ATHLETE") || auth.me.profiles.athleteProfileExists) {
      router.replace("/athlete");
    }
  }, [auth, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
        <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
          <PageHeader title="Загрузка" subtitle="Проверяем состояние аккаунта..." />
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Аккаунт создан"
          subtitle="Завершите настройку профиля или дождитесь назначения роли."
        />

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Если вы регистрировались как спортсмен, нажмите «Продолжить» и завершите onboarding.
          </p>
          <p>
            Если вам нужен доступ инфлюэнсера или администратора, роль должна быть выдана отдельно.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <AppButton
            type="button"
            onClick={() => {
              router.push("/onboarding");
            }}
          >
            Продолжить
          </AppButton>
          <AppButton type="button" variant="secondary" onClick={() => void auth.logout()}>
            Выйти
          </AppButton>
        </div>
      </section>
    </main>
  );
}
