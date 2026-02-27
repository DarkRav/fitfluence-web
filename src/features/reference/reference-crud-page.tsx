"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  AppButton,
  useAppToast,
} from "@/shared/ui";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { ReferenceFormDialog } from "@/features/reference/reference-form-dialog";
import { ReferenceTable } from "@/features/reference/reference-table";
import { ReferenceToolbar } from "@/features/reference/reference-toolbar";
import type { ReferenceCrudConfig } from "@/features/reference/reference-types";

type ReferenceCrudPageProps<
  TItem extends { id: string },
  TValues extends Record<string, string>,
> = {
  config: ReferenceCrudConfig<TItem, TValues>;
};

export function ReferenceCrudPage<
  TItem extends { id: string },
  TValues extends Record<string, string>,
>({ config }: ReferenceCrudPageProps<TItem, TValues>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<TItem | null>(null);
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();

  const listQuery = useQuery({
    queryKey: [config.queryKey, page, REFERENCE_LIST_PAGE_SIZE, search],
    queryFn: async () => {
      const result = await config.search({
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: TValues) => {
      if (editingItem) {
        const result = await config.update(editingItem.id, values);
        if (!result.ok) {
          throw new Error(result.error.message);
        }
        return "updated" as const;
      }

      const result = await config.create(values);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return "created" as const;
    },
    onSuccess: async (mode) => {
      pushToast({
        kind: "success",
        title: "Сохранено",
        description: mode === "created" ? config.getCreatedMessage() : config.getUpdatedMessage(),
      });
      setIsFormOpen(false);
      setEditingItem(null);
      await queryClient.invalidateQueries({
        queryKey: [config.queryKey],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await config.remove(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Удалено",
        description: config.getDeletedMessage(),
      });
      setDeleteItem(null);
      await queryClient.invalidateQueries({
        queryKey: [config.queryKey],
      });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;
  const formMode = editingItem ? "edit" : "create";
  const formValues = useMemo(
    () => (editingItem ? config.mapItemToValues(editingItem) : config.createDefaultValues()),
    [config, editingItem],
  );

  const actions = (
    <ReferenceToolbar
      search={search}
      searchPlaceholder={config.searchPlaceholder}
      createButtonLabel={config.createButtonLabel}
      onSearchChange={(value) => {
        setSearch(value);
        setPage(0);
      }}
      onCreateClick={() => {
        setEditingItem(null);
        setIsFormOpen(true);
      }}
    />
  );

  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} actions={actions} />

      {listQuery.isLoading ? <LoadingState title="Загружаем данные..." /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить список"
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data?.items.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description={search ? "Попробуйте изменить поисковый запрос." : "Справочник пока пуст."}
        />
      ) : null}

      {!listQuery.isLoading &&
      !listQuery.isError &&
      listQuery.data &&
      listQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <ReferenceTable
            items={listQuery.data.items}
            columns={config.columns}
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

      <ReferenceFormDialog
        open={isFormOpen}
        mode={formMode}
        title={formMode === "create" ? config.createDialogTitle : config.editDialogTitle}
        submitLabel="Сохранить"
        schema={config.schema}
        fields={config.fields}
        defaultValues={formValues}
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
        title={config.deleteDialogTitle}
        description={deleteItem ? config.deleteDialogDescription(deleteItem) : ""}
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
