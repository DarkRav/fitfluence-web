import {
  TableContainer,
  tableCellClassName,
  tableHeadClassName,
  tableRowClassName,
} from "@/components/ui";
import type { ReactNode } from "react";

type AppTableProps = {
  headers: string[];
  rows: ReactNode[][];
  className?: string;
};

export function AppTable({ headers, rows, className }: AppTableProps) {
  return (
    <TableContainer className={className}>
      <table className="w-full text-left text-sm">
        <thead className={tableHeadClassName}>
          <tr>
            {headers.map((header) => (
              <th key={header} className={tableCellClassName + " font-medium"}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={tableRowClassName}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className={tableCellClassName}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
