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
    <div className="grid w-full gap-2">
      <AppInput
        className="w-full sm:w-[320px]"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
      <div className="flex flex-wrap items-center gap-2">
        <AppButton onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          {createButtonLabel}
        </AppButton>
      </div>
    </div>
  );
}
