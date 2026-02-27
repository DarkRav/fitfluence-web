"use client";

import { Tabs } from "@/components/ui";
import { ru } from "@/localization/ru";

export type ProgramTopTabId = "info" | "workouts";

type ProgramTabsProps = {
  activeTab: ProgramTopTabId;
  onChange: (tab: ProgramTopTabId) => void;
};

export function ProgramTabs({ activeTab, onChange }: ProgramTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onChange={onChange}
      tabs={[
        { id: "info", label: ru.programs.tabs.info },
        { id: "workouts", label: ru.programs.tabs.workouts },
      ]}
    />
  );
}
