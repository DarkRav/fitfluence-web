"use client";

import { UserCircle2 } from "lucide-react";
import { useAuth } from "@/features/auth/use-auth";
import { ru } from "@/localization/ru";
import { AppButton } from "@/shared/ui";

export function Topbar() {
  const auth = useAuth();

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between rounded-lg px-4">
      <div>
        <p className="text-sm text-muted-foreground">{ru.layout.topbarTitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground">
          <UserCircle2 className="h-4 w-4 text-secondary" />
          <span>{auth.me?.displayName ?? auth.me?.email ?? ru.layout.userFallback}</span>
        </div>
        <AppButton variant="secondary" onClick={() => void auth.logout()}>
          {ru.layout.logout}
        </AppButton>
      </div>
    </header>
  );
}
