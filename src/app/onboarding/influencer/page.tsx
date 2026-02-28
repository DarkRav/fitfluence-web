"use client";

import { PageHeader } from "@/shared/ui";

export default function OnboardingInfluencerPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Создание профиля инфлюэнсера"
          subtitle="Форма создания профиля будет доступна на следующем шаге."
        />
      </section>
    </main>
  );
}
