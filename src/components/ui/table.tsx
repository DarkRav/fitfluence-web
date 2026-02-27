import { cn } from "@/lib/utils";

export const tableContainerClassName =
  "overflow-hidden rounded-2xl border border-border bg-card shadow-card";
export const tableHeadClassName = "bg-sidebar/60 text-muted-foreground";
export const tableRowClassName =
  "border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10";
export const tableCellClassName = "px-4 py-3";

export function TableContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(tableContainerClassName, className)} {...props} />;
}
