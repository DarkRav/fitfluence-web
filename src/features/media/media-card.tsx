import type { MediaRecord } from "@/api/media";

export function MediaCard({ item }: { item: MediaRecord }) {
  return (
    <article className="rounded-lg border border-border bg-card p-3 shadow-card">
      {item.type === "VIDEO" ? (
        <video
          className="h-32 w-full rounded-md border border-border/80 object-cover"
          src={item.url}
          muted
          preload="metadata"
        />
      ) : (
        <img
          className="h-32 w-full rounded-md border border-border/80 object-cover"
          src={item.url}
          alt={`Media ${item.id}`}
          loading="lazy"
        />
      )}
      <div className="mt-3 space-y-1 text-xs">
        <p className="truncate font-mono text-muted-foreground">{item.id}</p>
        <p className="text-foreground">{item.type}</p>
      </div>
    </article>
  );
}
