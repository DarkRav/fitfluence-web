"use client";

import Link from "next/link";
import { AppButton, PageHeader } from "@/shared/ui";

export default function OnboardingEntryPage() {
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
            href="/onboarding/athlete"
            className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-card"
          >
            <p className="text-lg font-semibold text-foreground">Я атлет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Для тренировок и персонального прогресса.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">Перейти к форме атлета</p>
          </Link>

          <Link
            href="/onboarding/influencer"
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
            <Link href="/login">Назад ко входу</Link>
          </AppButton>
        </div>
      </section>
    </main>
  );
}
