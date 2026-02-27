"use client";

import { useMemo, useState } from "react";
import { AppInput } from "@/shared/ui";
import { cn } from "@/lib/utils";
import type { ReferenceOption } from "@/api/referenceData";

type MultiSelectReferenceProps = {
  title: string;
  value: string[];
  options: ReferenceOption[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function MultiSelectReference({
  title,
  value,
  options,
  onChange,
  disabled,
}: MultiSelectReferenceProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  const selectedLabels = useMemo(
    () => options.filter((option) => value.includes(option.id)).map((option) => option.label),
    [options, value],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-foreground">{title}</label>
        <span className="text-xs text-muted-foreground">Выбрано: {value.length}</span>
      </div>

      <AppInput
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={`Поиск: ${title.toLowerCase()}`}
        disabled={disabled}
      />

      <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border/80 bg-sidebar/40 p-2">
        {filteredOptions.map((option) => {
          const checked = value.includes(option.id);

          return (
            <label
              key={option.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition hover:bg-secondary/10",
                disabled ? "cursor-not-allowed opacity-60" : "",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.checked) {
                    onChange([...value, option.id]);
                    return;
                  }

                  onChange(value.filter((current) => current !== option.id));
                }}
                className="h-4 w-4 rounded border-border bg-card text-secondary focus:ring-ring"
              />
              <span>{option.label}</span>
            </label>
          );
        })}

        {filteredOptions.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Совпадений не найдено.</p>
        ) : null}
      </div>

      {selectedLabels.length ? (
        <p className="text-xs text-muted-foreground">{selectedLabels.join(", ")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Ничего не выбрано.</p>
      )}
    </div>
  );
}
