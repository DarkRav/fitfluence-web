"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppButton, LoadingState, PageHeader } from "@/shared/ui";
import {
  resolveAuthReturnTo,
  resolveOnboardingEntryPath,
} from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function OnboardingEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const returnTo = resolveAuthReturnTo(searchParams.get("returnTo"));

  useEffect(() => {
    if (auth.status !== "authenticated" || !auth.me) {
      return;
    }

    const nextPath = resolveOnboardingEntryPath(auth.me, { returnTo, manualChoice: true });
    if (nextPath !== "/onboarding" && !nextPath.startsWith("/onboarding?")) {
      router.replace(nextPath);
    }
  }, [auth.me, auth.status, returnTo, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <LoadingState title="Проверяем состояние профиля..." />
      </main>
    );
  }

  const athletePath = returnTo
    ? `/onboarding/athlete?${new URLSearchParams({ returnTo }).toString()}`
    : "/onboarding/athlete";
  const influencerPath = returnTo
    ? `/onboarding/influencer?${new URLSearchParams({ returnTo }).toString()}`
    : "/onboarding/influencer";
  const loginPath = returnTo ? `/login?${new URLSearchParams({ returnTo }).toString()}` : "/login";

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Создание профиля"
          subtitle="Выберите тип профиля, чтобы продолжить. Это займёт меньше минуты."
        />

        <div className="mt-2 rounded-xl border border-border bg-sidebar/35 p-4 text-sm text-muted-foreground">
          Профиль определяет доступные разделы и сценарии работы в Fitfluence. Вы сможете добавить
          второй профиль позже.
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href={athletePath}
            className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-card"
          >
            <p className="text-lg font-semibold text-foreground">Я атлет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Для тренировок и персонального прогресса.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">Перейти к форме атлета</p>
          </Link>

          <Link
            href={influencerPath}
            className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-card"
          >
            <p className="text-lg font-semibold text-foreground">Я инфлюэнсер</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Для создания программ, тренировок и контента.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">Перейти к форме инфлюэнсера</p>
          </Link>
        </div>

        <div className="mt-6 flex justify-end">
          <AppButton asChild variant="secondary">
            <Link href={loginPath}>Назад ко входу</Link>
          </AppButton>
        </div>
      </section>
    </main>
  );
}
