"use client";

import { Plus } from "lucide-react";
import { AppButton, AppInput } from "@/shared/ui";

type ReferenceToolbarProps = {
  search: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
};

export function ReferenceToolbar({
  search,
  searchPlaceholder,
  createButtonLabel,
  onSearchChange,
  onCreateClick,
}: ReferenceToolbarProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <AppInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
      <AppButton onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        {createButtonLabel}
      </AppButton>
    </div>
  );
}
