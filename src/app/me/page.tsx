"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function MePage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
    }
  }, [auth.status, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
          <PageHeader title="Загрузка" subtitle="Проверяем авторизацию..." />
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader title="/v1/me" subtitle="Текущее состояние пользователя и профилей." />

        <pre className="max-h-[60vh] overflow-auto rounded-xl border border-border bg-sidebar/35 p-4 text-xs text-foreground">
          {JSON.stringify(auth.me, null, 2)}
        </pre>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <AppButton type="button" variant="secondary" onClick={() => router.push("/onboarding")}>
            В onboarding
          </AppButton>
          <AppButton type="button" variant="secondary" onClick={() => void auth.refreshMe()}>
            Обновить /v1/me
          </AppButton>
          <AppButton type="button" variant="secondary" onClick={() => void auth.logout()}>
            Выйти
          </AppButton>
        </div>
      </section>
    </main>
  );
}
