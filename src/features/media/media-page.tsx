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
import { type MediaOwnerType } from "@/api/gen";
import {
  AppButton,
  AppInput,
  AppSelect,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "@/shared/ui";
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
const ownerTypeOptions = [
  { value: "ALL", label: "Все владельцы" },
  { value: "ADMIN", label: "Администратор" },
  { value: "INFLUENCER", label: "Инфлюэнсер" },
] as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function MediaPage({ role, title, subtitle, pickMode = false, onPick }: MediaPageProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [ownerType, setOwnerType] = useState<(typeof ownerTypeOptions)[number]["value"]>("ALL");
  const [ownerId, setOwnerId] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const isAdmin = role === "ADMIN";
  const ownerIdNormalized = ownerId.trim();
  const isOwnerIdInvalid = ownerIdNormalized.length > 0 && !UUID_REGEX.test(ownerIdNormalized);

  const effectiveOwnerType: MediaOwnerType | undefined =
    isAdmin && ownerType !== "ALL" ? ownerType : undefined;
  const effectiveOwnerId = isAdmin ? ownerIdNormalized || undefined : undefined;

  const query = useQuery<MediaPageResult, Error>({
    queryKey: ["media", role, page, search, effectiveOwnerType, effectiveOwnerId],
    enabled: !isOwnerIdInvalid,
    queryFn: async () => {
      const response =
        role === "ADMIN"
          ? await searchAdminMedia({
              page,
              size: PAGE_SIZE,
              search,
              ownerType: effectiveOwnerType,
              ownerId: effectiveOwnerId,
            })
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
      <div className="flex w-full flex-wrap items-start gap-2">
        <div className="min-w-[220px] flex-1">
          <AppInput
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Поиск по ID или тегу"
          />
        </div>
        {isAdmin ? (
          <>
            <div className="w-[210px]">
              <AppSelect
                value={ownerType}
                onValueChange={(value) => {
                  setOwnerType(value as (typeof ownerTypeOptions)[number]["value"]);
                  setPage(0);
                }}
                options={ownerTypeOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                placeholder="Тип владельца"
              />
            </div>
            <div className="w-[300px]">
              <AppInput
                value={ownerId}
                onChange={(event) => {
                  setOwnerId(event.target.value);
                  setPage(0);
                }}
                placeholder="ID владельца (UUID)"
              />
              {isOwnerIdInvalid ? (
                <p className="mt-1 text-xs text-destructive">Укажите корректный UUID.</p>
              ) : null}
            </div>
          </>
        ) : null}
        <MediaUploadDialog role={role} />
      </div>
    ),
    [isAdmin, isOwnerIdInvalid, ownerId, ownerType, role, search],
  );

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />

      {isOwnerIdInvalid ? (
        <ErrorState title="Некорректный фильтр" description="Укажите корректный UUID владельца." />
      ) : null}

      {!isOwnerIdInvalid && query.isLoading ? <LoadingState title="Загружаем медиа..." /> : null}

      {!isOwnerIdInvalid && !query.isLoading && query.isError ? (
        <ErrorState
          title="Не удалось загрузить медиа"
          description={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {!isOwnerIdInvalid &&
      !query.isLoading &&
      !query.isError &&
      query.data &&
      query.data.items.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description={search ? "Попробуйте изменить поисковый запрос." : "Список медиа пока пуст."}
        />
      ) : null}

      {!isOwnerIdInvalid &&
      !query.isLoading &&
      !query.isError &&
      query.data &&
      query.data.items.length > 0 ? (
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
