"use client";

import { cn } from "@/lib/utils";
import { ru } from "@/localization/ru";

export type ProgramTopTabId = "info" | "workouts" | "settings";

type ProgramTabsProps = {
  activeTab: ProgramTopTabId;
  onChange: (tab: ProgramTopTabId) => void;
};

export function ProgramTabs({ activeTab, onChange }: ProgramTabsProps) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-sidebar/40 p-1">
      <button
        type="button"
        className={cn(
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          activeTab === "info"
            ? "bg-primary-gradient text-primary-foreground shadow-card"
            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
        )}
        onClick={() => onChange("info")}
      >
        {ru.programs.tabs.info}
      </button>
      <button
        type="button"
        className={cn(
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          activeTab === "workouts"
            ? "bg-primary-gradient text-primary-foreground shadow-card"
            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
        )}
        onClick={() => onChange("workouts")}
      >
        {ru.programs.tabs.workouts}
      </button>
      <button
        type="button"
        className={cn(
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          activeTab === "settings"
            ? "bg-primary-gradient text-primary-foreground shadow-card"
            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
        )}
        onClick={() => onChange("settings")}
      >
        {ru.programs.tabs.settings}
      </button>
    </div>
  );
}
