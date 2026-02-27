"use client";

import { UserCircle2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between rounded-lg px-4">
      <div>
        <p className="text-sm text-muted-foreground">Fitfluence Control Room</p>
      </div>
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground"
      >
        <UserCircle2 className="h-4 w-4 text-secondary" />
        <span>Пользователь</span>
      </button>
    </header>
  );
}
