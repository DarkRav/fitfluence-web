import type { MediaRecord } from "@/api/media";
import {
  TableContainer,
  tableCellClassName,
  tableHeadClassName,
  tableRowClassName,
} from "@/components/ui";
import { AppButton } from "@/shared/ui";

type MediaTableProps = {
  items: MediaRecord[];
  onOpenDetails?: (id: string) => void;
  onPick?: (id: string) => void;
  pickMode?: boolean;
};

function renderPreview(item: MediaRecord) {
  if (item.type === "VIDEO") {
    return (
      <video
        className="h-12 w-20 rounded-md border border-border/80 object-cover"
        src={item.url}
        muted
        preload="metadata"
      />
    );
  }

  return (
    <img
      className="h-12 w-20 rounded-md border border-border/80 object-cover"
      src={item.url}
      alt={`Медиа ${item.id}`}
      loading="lazy"
    />
  );
}

export function MediaTable({ items, onOpenDetails, onPick, pickMode = false }: MediaTableProps) {
  const canClickRow = Boolean(onOpenDetails) || (pickMode && Boolean(onPick));

  return (
    <TableContainer>
      <table className="w-full text-left text-sm">
        <thead className={tableHeadClassName}>
          <tr>
            <th className={`${tableCellClassName} font-medium`}>Превью</th>
            <th className={`${tableCellClassName} font-medium`}>ID</th>
            <th className={`${tableCellClassName} font-medium`}>Тип</th>
            <th className={`${tableCellClassName} font-medium`}>Теги</th>
            <th className={`${tableCellClassName} font-medium`}>Создано</th>
            <th className={`${tableCellClassName} font-medium`}>Владелец</th>
            {(onOpenDetails || pickMode) && (
              <th className={`${tableCellClassName} font-medium`}>Действие</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`${tableRowClassName} ${canClickRow ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (pickMode) {
                  onPick?.(item.id);
                  return;
                }
                onOpenDetails?.(item.id);
              }}
            >
              <td className={tableCellClassName}>{renderPreview(item)}</td>
              <td className={`max-w-[260px] truncate ${tableCellClassName} font-mono text-xs`}>
                {item.id}
              </td>
              <td className={tableCellClassName}>{item.type}</td>
              <td className={tableCellClassName}>
                {item.tags.length > 0 ? (
                  <div className="flex max-w-[240px] flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded border border-border bg-secondary/10 px-1.5 py-0.5 text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className={tableCellClassName}>
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
              </td>
              <td className={tableCellClassName}>{item.owner ?? "-"}</td>
              {(onOpenDetails || pickMode) && (
                <td className={tableCellClassName}>
                  {pickMode ? (
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onPick?.(item.id);
                      }}
                    >
                      Выбрать
                    </AppButton>
                  ) : (
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenDetails?.(item.id);
                      }}
                    >
                      Детали
                    </AppButton>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
