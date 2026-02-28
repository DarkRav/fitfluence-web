"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, PageHeader } from "@/shared/ui";
import { resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";

export default function MePage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me) {
      router.replace(resolvePostLoginPath(auth.me));
    }
  }, [auth.me, auth.status, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Переход в рабочий раздел"
          subtitle="Проверяем профиль и права доступа."
        />
        <LoadingState title="Подготавливаем интерфейс..." />
      </section>
    </main>
  );
}
