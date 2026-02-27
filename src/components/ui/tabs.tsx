import { cn } from "@/lib/utils";

export type TabOption<T extends string> = {
  id: T;
  label: string;
};

type TabsProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  tabs: TabOption<T>[];
  className?: string;
};

export function Tabs<T extends string>({ value, onChange, tabs, className }: TabsProps<T>) {
  return (
    <div className={cn("inline-flex rounded-xl border border-border bg-sidebar/40 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "h-10 rounded-lg px-4 text-sm font-medium transition",
            value === tab.id
              ? "bg-secondary/15 text-secondary shadow-card"
              : "text-muted-foreground hover:bg-card hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
