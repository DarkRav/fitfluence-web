"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import {
  createInfluencerProgram,
  searchInfluencerPrograms,
  type CreateInfluencerProgramPayload,
  type InfluencerProgramsPageResult,
} from "@/api/influencerPrograms";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ProgramCreateDialog } from "@/features/programs/program-create-dialog";
import { ProgramsTable } from "@/features/programs/programs-table";
import {
  AppButton,
  AppInput,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

export function InfluencerProgramsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const listQuery = useQuery<InfluencerProgramsPageResult, Error>({
    queryKey: ["influencerPrograms", page, REFERENCE_LIST_PAGE_SIZE, debouncedSearch, {}],
    queryFn: async () => {
      const result = await searchInfluencerPrograms({
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search: debouncedSearch,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!listQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: "Не удалось загрузить программы",
      description: listQuery.error.message,
    });
  }, [listQuery.error, listQuery.isError, pushToast]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateInfluencerProgramPayload) => {
      const result = await createInfluencerProgram(payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async (program) => {
      pushToast({
        kind: "success",
        title: "Программа создана",
        description: "Метаданные программы успешно сохранены.",
      });
      setIsCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["influencerPrograms"] });
      router.push(`/influencer/programs/${program.id}`);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось создать программу";
      pushToast({
        kind: "error",
        title: "Ошибка создания",
        description: message,
      });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  return (
    <div>
      <PageHeader
        title="Programs"
        subtitle="Управляйте метаданными программ инфлюэнсера."
        actions={
          <div className="flex w-full max-w-4xl items-center gap-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по названию программы"
            />
            <AppButton
              type="button"
              onClick={() => setIsCreateOpen(true)}
              disabled={createMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </AppButton>
          </div>
        }
      />

      {listQuery.isLoading ? <LoadingState title="Загружаем программы..." /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить программы"
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && (listQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Программы не найдены"
          description={search ? "Смените поисковый запрос." : "Создайте первую программу."}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data ? (
        <div className="space-y-4">
          <ProgramsTable
            items={listQuery.data.items}
            onOpen={(item) => router.push(`/influencer/programs/${item.id}`)}
          />
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              Страница {listQuery.data.page + 1} / {Math.max(listQuery.data.totalPages, 1)} •{" "}
              {listQuery.data.totalElements} элементов
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={!hasPrev}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                type="button"
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

      <ProgramCreateDialog
        open={isCreateOpen}
        isSubmitting={createMutation.isPending}
        onOpenChange={setIsCreateOpen}
        onSubmit={async (payload) => {
          await createMutation.mutateAsync(payload);
        }}
      />
    </div>
  );
}
