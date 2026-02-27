"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  searchAdminMedia,
  searchInfluencerMedia,
  type MediaPageResult,
  type MediaRole,
} from "@/api/media";
import { AppButton, AppInput, EmptyState, ErrorState, LoadingState } from "@/shared/ui";
import { MediaTable } from "@/features/media/media-table";
import { MediaUploadDialog } from "@/features/media/media-upload-dialog";

type MediaPickerDialogProps = {
  role: MediaRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
};

const PAGE_SIZE = 12;

export function MediaPickerDialog({ role, open, onOpenChange, onSelect }: MediaPickerDialogProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const mediaQuery = useQuery<MediaPageResult, Error>({
    queryKey: ["media", "picker", role, page, search],
    enabled: open,
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
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Выбор медиа
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Выберите один файл из библиотеки медиа.
          </Dialog.Description>

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[240px] flex-1">
                <AppInput
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(0);
                  }}
                  placeholder="Поиск по ID или тегу"
                />
              </div>
              <MediaUploadDialog
                role={role}
                triggerVariant="secondary"
                triggerLabel="Загрузить файл"
                onUploaded={(mediaId) => {
                  onSelect(mediaId);
                  onOpenChange(false);
                }}
              />
            </div>

            {mediaQuery.isLoading ? <LoadingState title="Загружаем медиа..." /> : null}
            {mediaQuery.isError ? (
              <ErrorState
                title="Не удалось загрузить медиа"
                description={mediaQuery.error.message}
                onRetry={() => void mediaQuery.refetch()}
              />
            ) : null}
            {!mediaQuery.isLoading && !mediaQuery.isError && mediaQuery.data?.items.length === 0 ? (
              <EmptyState
                title="Ничего не найдено"
                description="Попробуйте изменить поисковый запрос."
              />
            ) : null}

            {!mediaQuery.isLoading && !mediaQuery.isError && mediaQuery.data?.items.length ? (
              <div className="space-y-3">
                <MediaTable
                  items={mediaQuery.data.items}
                  pickMode
                  onPick={(id) => {
                    onSelect(id);
                    onOpenChange(false);
                  }}
                />

                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
                  <p className="text-muted-foreground">
                    Страница {mediaQuery.data.page + 1} / {Math.max(mediaQuery.data.totalPages, 1)}
                  </p>
                  <div className="flex items-center gap-2">
                    <AppButton
                      variant="secondary"
                      disabled={page <= 0}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      Назад
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      disabled={page + 1 >= mediaQuery.data.totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Вперед
                    </AppButton>
                  </div>
                </div>
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
