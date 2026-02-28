"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function AthletePlaceholderPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me) {
      if (
        auth.me.onboarding.requiresAthleteProfile ||
        auth.me.onboarding.requiresInfluencerProfile
      ) {
        router.replace("/onboarding");
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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Профиль атлета создан"
          subtitle="Веб-интерфейс для атлета пока недоступен."
        />
        <div className="mt-6 flex justify-end">
          <AppButton type="button" variant="secondary" onClick={() => void auth.logout()}>
            Выйти
          </AppButton>
        </div>
      </section>
    </main>
  );
}
