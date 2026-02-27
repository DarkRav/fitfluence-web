"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchAdminMedia,
  searchInfluencerMedia,
  type MediaRecord,
  type MediaPageResult,
  type MediaRole,
} from "@/api/media";
import { AppButton, AppInput, EmptyState, ErrorState, LoadingState, PageHeader } from "@/shared/ui";
import { MediaDetailsDialog } from "@/features/media/media-details-dialog";
import { MediaTable } from "@/features/media/media-table";
import { MediaUploadDialog } from "@/features/media/media-upload-dialog";

type MediaPageProps = {
  role: MediaRole;
  title: string;
  subtitle: string;
  pickMode?: boolean;
  onPick?: (id: string) => void;
};

const PAGE_SIZE = 20;

export function MediaPage({ role, title, subtitle, pickMode = false, onPick }: MediaPageProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const query = useQuery<MediaPageResult, Error>({
    queryKey: ["media", role, page, search],
    queryFn: async () => {
      const response =
        role === "ADMIN"
          ? await searchAdminMedia({ page, size: PAGE_SIZE, search })
          : await searchInfluencerMedia({ page, size: PAGE_SIZE, search });

      if (!response.ok) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const totalPages = query.data?.totalPages ?? 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;
  const selectedMedia: MediaRecord | undefined = query.data?.items.find(
    (item) => item.id === selectedMediaId,
  );

  const actions = useMemo(
    () => (
      <div className="flex w-full max-w-2xl items-center gap-2">
        <AppInput
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          placeholder="Поиск по ID или тегу"
        />
        <MediaUploadDialog role={role} />
      </div>
    ),
    [role, search],
  );

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />

      {query.isLoading ? <LoadingState title="Загружаем медиа..." /> : null}

      {!query.isLoading && query.isError ? (
        <ErrorState
          title="Не удалось загрузить медиа"
          description={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {!query.isLoading && !query.isError && query.data && query.data.items.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description={search ? "Попробуйте изменить поисковый запрос." : "Список медиа пока пуст."}
        />
      ) : null}

      {!query.isLoading && !query.isError && query.data && query.data.items.length > 0 ? (
        <div className="space-y-4">
          <MediaTable
            items={query.data.items}
            pickMode={pickMode}
            onPick={onPick}
            onOpenDetails={(id) => {
              setSelectedMediaId(id);
              setDetailsOpen(true);
            }}
          />

          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              Страница {query.data.page + 1} / {Math.max(query.data.totalPages, 1)} •{" "}
              {query.data.totalElements} элементов
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                variant="secondary"
                disabled={!hasPrev}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                variant="secondary"
                disabled={!hasNext}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Вперед
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}

      <MediaDetailsDialog
        role={role}
        open={detailsOpen}
        mediaId={selectedMediaId}
        fallbackMedia={selectedMedia}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
