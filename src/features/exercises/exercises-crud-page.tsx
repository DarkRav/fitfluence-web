"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { ExerciseFormDialog } from "@/features/exercises/exercise-form-dialog";
import { ExercisesTable } from "@/features/exercises/exercises-table";
import { ExerciseToolbar } from "@/features/exercises/exercise-toolbar";
import type { ExerciseCrudItem, ExercisesCrudScopeConfig } from "@/features/exercises/types";
import {
  AppButton,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

type ExercisesCrudPageProps = {
  config: ExercisesCrudScopeConfig;
};

export function ExercisesCrudPage({ config }: ExercisesCrudPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingItem, setEditingItem] = useState<ExerciseCrudItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ExerciseCrudItem | null>(null);
  const filters = useMemo(() => ({}), []);
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const listQuery = useQuery({
    queryKey: [...config.queryKeyPrefix, page, REFERENCE_LIST_PAGE_SIZE, debouncedSearch, filters],
    queryFn: async () => {
      const result = await config.api.search({
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

  const musclesQuery = useQuery({
    queryKey: [...config.queryKeyPrefix, "muscle-options"],
    queryFn: async () => {
      const result = await config.references.loadMuscles("");
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
  });

  const equipmentQuery = useQuery({
    queryKey: [...config.queryKeyPrefix, "equipment-options"],
    queryFn: async () => {
      const result = await config.references.loadEquipment("");
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
  });

  const saveMutation = useMutation({
    mutationFn: async (
      values: Parameters<typeof config.api.create>[0] | Parameters<typeof config.api.update>[1],
    ) => {
      if (editingItem) {
        const result = await config.api.update(editingItem.id, values);
        if (!result.ok) {
          throw new Error(result.error.message);
        }

        return "updated" as const;
      }

      const result = await config.api.create(values as Parameters<typeof config.api.create>[0]);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return "created" as const;
    },
    onSuccess: async (mode) => {
      pushToast({
        kind: "success",
        title: "Сохранено",
        description: mode === "created" ? config.messages.created : config.messages.updated,
      });
      setIsFormOpen(false);
      setEditingItem(null);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await config.api.remove(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Архивировано",
        description: config.messages.deleted,
      });
      setDeleteItem(null);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  const actions = (
    <ExerciseToolbar
      search={search}
      searchPlaceholder={config.searchPlaceholder}
      createButtonLabel={config.createButtonLabel}
      onSearchChange={setSearch}
      onCreateClick={() => {
        setEditingItem(null);
        setIsFormOpen(true);
      }}
    />
  );

  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} actions={actions} />

      {listQuery.isLoading ? <LoadingState title="Загружаем упражнения..." /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить упражнения"
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data?.items.length === 0 ? (
        <EmptyState
          title="Упражнения не найдены"
          description={search ? "Смените поисковый запрос." : "Создайте первое упражнение."}
        />
      ) : null}

      {!listQuery.isLoading &&
      !listQuery.isError &&
      listQuery.data &&
      listQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <ExercisesTable
            items={listQuery.data.items}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onDelete={(item) => {
              setDeleteItem(item);
            }}
          />

          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              Страница {listQuery.data.page + 1} / {Math.max(listQuery.data.totalPages, 1)} •{" "}
              {listQuery.data.totalElements} элементов
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                variant="secondary"
                disabled={!hasPrev}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                variant="secondary"
                disabled={!hasNext}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Вперед
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}

      <ExerciseFormDialog
        open={isFormOpen}
        mode={editingItem ? "edit" : "create"}
        scope={config.scope}
        item={editingItem ?? undefined}
        muscleOptions={musclesQuery.data ?? []}
        equipmentOptions={equipmentQuery.data ?? []}
        isSubmitting={saveMutation.isPending}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        onSubmit={async (values) => {
          await saveMutation.mutateAsync(values);
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteItem)}
        title={config.deleteDialog.title}
        description={deleteItem ? config.deleteDialog.description(deleteItem) : ""}
        isSubmitting={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem.id);
          }
        }}
      />
    </div>
  );
}
