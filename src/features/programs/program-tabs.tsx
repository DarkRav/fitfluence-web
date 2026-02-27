"use client";

import { cn } from "@/lib/utils";

export type ProgramTabId = "details" | "versions";

type ProgramTabsProps = {
  activeTab: ProgramTabId;
  onChange: (tab: ProgramTabId) => void;
};

export function ProgramTabs({ activeTab, onChange }: ProgramTabsProps) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-sidebar/40 p-1">
      <button
        type="button"
        className={cn(
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          activeTab === "details"
            ? "bg-primary-gradient text-primary-foreground shadow-card"
            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
        )}
        onClick={() => onChange("details")}
      >
        Details
      </button>
      <button
        type="button"
        className={cn(
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          activeTab === "versions"
            ? "bg-primary-gradient text-primary-foreground shadow-card"
            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
        )}
        onClick={() => onChange("versions")}
      >
        Versions
      </button>
    </div>
  );
}
