"use client";

import { MultiSelectReference } from "@/features/exercises/multi-select-reference";
import type { ReferenceOption } from "@/api/referenceData";

type MultiSelectMusclesProps = {
  value: string[];
  options: ReferenceOption[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function MultiSelectMuscles({
  value,
  options,
  onChange,
  disabled,
}: MultiSelectMusclesProps) {
  return (
    <MultiSelectReference
      title="Мышцы"
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
