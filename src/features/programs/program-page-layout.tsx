import type { ReactNode } from "react";
import { ProgramTabs, type ProgramTopTabId } from "@/features/programs/program-tabs";

type ProgramPageLayoutProps = {
  tabs: {
    active: ProgramTopTabId;
    onChange: (tab: ProgramTopTabId) => void;
  };
  header: ReactNode;
  toolbar?: ReactNode;
  content: ReactNode;
};

export function ProgramPageLayout({ tabs, header, toolbar, content }: ProgramPageLayoutProps) {
  return (
    <div className="space-y-4">
      {header}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <ProgramTabs activeTab={tabs.active} onChange={tabs.onChange} />
          {toolbar}
        </div>
        {content}
      </div>
    </div>
  );
}
