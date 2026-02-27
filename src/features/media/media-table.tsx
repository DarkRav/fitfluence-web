import type { MediaRecord } from "@/api/media";

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
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-sidebar/60 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Превью</th>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Тип</th>
            <th className="px-4 py-3 font-medium">Создано</th>
            <th className="px-4 py-3 font-medium">Владелец</th>
            {(onOpenDetails || pickMode) && <th className="px-4 py-3 font-medium">Действие</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
            >
              <td className="px-4 py-3">{renderPreview(item)}</td>
              <td className="max-w-[260px] truncate px-4 py-3 font-mono text-xs">{item.id}</td>
              <td className="px-4 py-3">{item.type}</td>
              <td className="px-4 py-3">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
              </td>
              <td className="px-4 py-3">{item.owner ?? "-"}</td>
              {(onOpenDetails || pickMode) && (
                <td className="px-4 py-3">
                  {pickMode ? (
                    <button
                      type="button"
                      className="rounded-md border border-secondary/35 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary transition hover:bg-secondary/20"
                      onClick={() => onPick?.(item.id)}
                    >
                      Выбрать
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-md border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-secondary/40 hover:text-secondary"
                      onClick={() => onOpenDetails?.(item.id)}
                    >
                      Детали
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
