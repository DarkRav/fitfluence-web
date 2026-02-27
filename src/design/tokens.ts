export const tokens = {
  colors: {
    background: "#0F1115",
    card: "#151821",
    sidebar: "#0C0E12",
    border: "#232733",
    textPrimary: "#F3F4F6",
    textSecondary: "#9CA3AF",
    muted: "#6B7280",
    primary: "#F6D365",
    primaryHover: "#F9E7A5",
    primaryForeground: "#111111",
    secondary: "#6EDDD6",
    secondaryHover: "#A5F0EB",
    secondaryForeground: "#0F1115",
    destructive: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    info: "#60A5FA",
  },
  radius: {
    card: "16px",
    control: "12px",
  },
} as const;

export type FitfluenceTokens = typeof tokens;
