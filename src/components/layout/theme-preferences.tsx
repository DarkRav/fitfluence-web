"use client";

import { useEffect, useState } from "react";
import { AppSelect, type SelectOption } from "@/shared/ui";
import { ru } from "@/localization/ru";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "fitfluence.theme";

const options: SelectOption[] = [
  { value: "dark", label: ru.layout.themeDark },
  { value: "light", label: ru.layout.themeLight },
];

function applyTheme(nextTheme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(nextTheme);
}

function readSavedTheme(): ThemeMode {
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" ? "light" : "dark";
}

export function ThemePreferences() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const savedTheme = readSavedTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{ru.layout.preferences}</span>
      <div className="w-[170px]">
        <AppSelect
          value={theme}
          options={options}
          onValueChange={(value) => {
            const nextTheme: ThemeMode = value === "light" ? "light" : "dark";
            setTheme(nextTheme);
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            applyTheme(nextTheme);
          }}
        />
      </div>
    </div>
  );
}
