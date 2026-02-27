"use client";

import { MultiSelectReference } from "@/features/exercises/multi-select-reference";
import type { ReferenceOption } from "@/api/referenceData";

type MultiSelectEquipmentProps = {
  value: string[];
  options: ReferenceOption[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function MultiSelectEquipment({
  value,
  options,
  onChange,
  disabled,
}: MultiSelectEquipmentProps) {
  return (
    <MultiSelectReference
      title="Оборудование"
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
