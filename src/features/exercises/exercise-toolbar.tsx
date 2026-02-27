"use client";

import { Plus } from "lucide-react";
import { AppButton, AppInput } from "@/shared/ui";

type ExerciseToolbarProps = {
  search: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
};

export function ExerciseToolbar({
  search,
  searchPlaceholder,
  createButtonLabel,
  onSearchChange,
  onCreateClick,
}: ExerciseToolbarProps) {
  return (
    <div className="flex w-full max-w-4xl items-center gap-2">
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
