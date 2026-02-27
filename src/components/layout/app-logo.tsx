import { Flame } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-primary-gradient text-primary-foreground shadow-card">
        <Flame className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-sidebar-foreground">Fitfluence</p>
        <p className="text-[11px] text-muted-foreground">админ-панель</p>
      </div>
    </div>
  );
}
