"use client";

import Link from "next/link";
import { AppButton, PageHeader } from "@/shared/ui";

export default function OnboardingEntryPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader title="Создание профиля" subtitle="Выберите тип профиля, чтобы продолжить." />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href="/onboarding/athlete"
            className="rounded-2xl border border-border bg-sidebar/35 p-5 transition hover:bg-sidebar/55"
          >
            <p className="text-lg font-semibold text-foreground">Я атлет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Для тренировок и персонального прогресса.
            </p>
          </Link>

          <Link
            href="/onboarding/influencer"
            className="rounded-2xl border border-border bg-sidebar/35 p-5 transition hover:bg-sidebar/55"
          >
            <p className="text-lg font-semibold text-foreground">Я инфлюэнсер</p>
            <p className="mt-1 text-sm text-muted-foreground">Для создания программ и контента.</p>
          </Link>
        </div>

        <div className="mt-6 flex justify-end">
          <AppButton asChild variant="secondary">
            <Link href="/login">Назад</Link>
          </AppButton>
        </div>
      </section>
    </main>
  );
}
