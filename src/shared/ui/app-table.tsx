import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AppTableProps = {
  headers: string[];
  rows: ReactNode[][];
  className?: string;
};

export function AppTable({ headers, rows, className }: AppTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/50 text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border/80 text-foreground">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
