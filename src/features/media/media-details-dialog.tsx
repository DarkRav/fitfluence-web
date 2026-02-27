"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMediaById, type MediaRecord, type MediaRole } from "@/api/media";
import { ErrorState, LoadingState } from "@/shared/ui";

type MediaDetailsDialogProps = {
  role: MediaRole;
  mediaId: string | null;
  fallbackMedia?: MediaRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MediaPreview({ media }: { media: MediaRecord }) {
  if (media.type === "VIDEO") {
    return (
      <video
        className="h-56 w-full rounded-lg border border-border/80 object-cover"
        src={media.url}
        controls
        preload="metadata"
      />
    );
  }

  return (
    <img
      className="h-56 w-full rounded-lg border border-border/80 object-cover"
      src={media.url}
      alt={`Медиа ${media.id}`}
    />
  );
}

export function MediaDetailsDialog({
  role,
  mediaId,
  fallbackMedia,
  open,
  onOpenChange,
}: MediaDetailsDialogProps) {
  const detailsQuery = useQuery<MediaRecord, Error>({
    queryKey: ["media", "details", role, mediaId],
    enabled: open && role === "ADMIN" && !!mediaId,
    queryFn: async () => {
      if (!mediaId) {
        throw new Error("Не указан идентификатор медиа");
      }

      const result = await getMediaById(mediaId, role);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const media = role === "INFLUENCER" ? fallbackMedia : detailsQuery.data;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Детали медиа
          </Dialog.Title>

          <div className="mt-4">
            {role === "ADMIN" && detailsQuery.isLoading ? (
              <LoadingState title="Загружаем карточку медиа..." />
            ) : null}

            {role === "ADMIN" && detailsQuery.isError ? (
              <ErrorState
                title="Не удалось загрузить карточку"
                description={detailsQuery.error.message}
              />
            ) : null}

            {media ? (
              <div className="space-y-4">
                <MediaPreview media={media} />
                <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3">
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-foreground">{media.id}</dd>
                  </div>
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3">
                    <dt className="text-muted-foreground">Тип</dt>
                    <dd className="mt-1 text-foreground">{media.type}</dd>
                  </div>
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3">
                    <dt className="text-muted-foreground">Создано</dt>
                    <dd className="mt-1 text-foreground">
                      {media.createdAt ? new Date(media.createdAt).toLocaleString() : "-"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3">
                    <dt className="text-muted-foreground">MIME-тип</dt>
                    <dd className="mt-1 text-foreground">{media.mimeType ?? "-"}</dd>
                  </div>
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3 md:col-span-2">
                    <dt className="text-muted-foreground">Теги</dt>
                    <dd className="mt-1">
                      {media.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {media.tags.map((tag) => (
                            <span
                              key={`${media.id}-${tag}`}
                              className="rounded border border-border bg-secondary/10 px-2 py-1 text-xs text-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-foreground">-</span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-border bg-sidebar/40 p-3 md:col-span-2">
                    <dt className="text-muted-foreground">URL</dt>
                    <dd className="mt-1 break-all text-foreground">{media.url}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>

          <Dialog.Close className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition hover:bg-card">
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
