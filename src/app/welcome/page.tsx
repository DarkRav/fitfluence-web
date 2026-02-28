"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader, useAppToast } from "@/shared/ui";
import { resolvePostLoginPath } from "@/features/auth/post-login-routing";
import { useAuth } from "@/features/auth/use-auth";
import { useState } from "react";
import { getMe } from "@/api/me";

export default function WelcomePage() {
  const router = useRouter();
  const auth = useAuth();
  const { pushToast } = useAppToast();
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me) {
      const nextPath = resolvePostLoginPath(auth.me);
      if (nextPath !== "/welcome") {
        router.replace(nextPath);
      }
    }
  }, [auth.me, auth.status, router]);

  if (auth.status !== "authenticated") {
    return null;
  }

  const onCheckAccess = async () => {
    setIsCheckingAccess(true);
    try {
      await auth.refreshMe();
      const meResult = await getMe();
      if (!meResult.ok || !meResult.data.roles.includes("INFLUENCER")) {
        pushToast({
          kind: "info",
          title: "Доступ пока не выдан",
          description: "Попробуйте позже или обратитесь к администратору.",
        });
      }
    } finally {
      setIsCheckingAccess(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Профиль создан"
          subtitle="Ваш аккаунт зарегистрирован, но доступ к разделу программ пока не выдан."
        />

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Обычно права назначаются автоматически или администратором системы.</p>
          <p>Нажмите «Проверить доступ», чтобы обновить статус.</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <AppButton
            type="button"
            variant="secondary"
            disabled={isCheckingAccess}
            onClick={() => void onCheckAccess()}
          >
            {isCheckingAccess ? "Проверяем..." : "Проверить доступ"}
          </AppButton>
          <AppButton type="button" variant="secondary" onClick={() => void auth.logout()}>
            Выйти
          </AppButton>
        </div>
      </section>
    </main>
  );
}
