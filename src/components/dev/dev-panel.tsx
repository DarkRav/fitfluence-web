"use client";

import { useMemo } from "react";
import { AppButton } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export function DevPanel() {
  const auth = useAuth();
  const isDev = process.env.NODE_ENV !== "production";

  const baseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9876",
    [],
  );

  if (!isDev) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-card p-4 text-xs shadow-card">
      <p className="font-semibold text-foreground">Панель разработки</p>
      <div className="mt-3 space-y-2 text-muted-foreground">
        <p>
          <span className="text-foreground">Базовый URL:</span> {baseUrl}
        </p>
        <p>
          <span className="text-foreground">Пользователь:</span> {auth.me?.email ?? "аноним"}
        </p>
        <p>
          <span className="text-foreground">Роли:</span> {auth.roles.join(", ") || "нет"}
        </p>
      </div>
      <AppButton variant="secondary" className="mt-3 w-full" onClick={() => void auth.logout()}>
        Выйти
      </AppButton>
    </aside>
  );
}
