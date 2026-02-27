"use client";

import { Select, type SelectOption } from "@/components/ui";

export type { SelectOption };

type AppSelectProps = {
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
};

export function AppSelect(props: AppSelectProps) {
  return <Select {...props} />;
}
