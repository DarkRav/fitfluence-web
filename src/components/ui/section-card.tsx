import { cn } from "@/lib/utils";

export function SectionCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}
      {...props}
    />
  );
}
