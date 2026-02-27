"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type {
  AdminProgressionPolicyOwnerType,
  AdminProgressionPolicyStatus,
  AdminProgressionPolicyType,
  CreateAdminProgressionPolicyPayload,
  UpdateAdminProgressionPolicyPayload,
} from "@/api/adminProgression";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { ProgressionFormDialog } from "@/features/progression/progression-form-dialog";
import { ProgressionTable } from "@/features/progression/progression-table";
import type {
  ProgressionRecord,
  ProgressionScopeConfig,
  ProgressionSearchFilters,
} from "@/features/progression/types";
import {
  AppButton,
  AppInput,
  AppSelect,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

type ProgressionCrudPageProps = {
  config: ProgressionScopeConfig;
};

const statusOptions: { value: "ALL" | AdminProgressionPolicyStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "ARCHIVED", label: "ARCHIVED" },
];

const typeOptions: { value: "ALL" | AdminProgressionPolicyType; label: string }[] = [
  { value: "ALL", label: "All types" },
  { value: "DOUBLE_PROGRESSION", label: "DOUBLE_PROGRESSION" },
  { value: "LINEAR_LOAD", label: "LINEAR_LOAD" },
  { value: "RPE_BASED", label: "RPE_BASED" },
];

const ownerTypeOptions: { value: "ALL" | AdminProgressionPolicyOwnerType; label: string }[] = [
  { value: "ALL", label: "All owners" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "INFLUENCER", label: "INFLUENCER" },
];

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function ProgressionCrudPage({ config }: ProgressionCrudPageProps) {
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<(typeof statusOptions)[number]["value"]>("ALL");
  const [type, setType] = useState<(typeof typeOptions)[number]["value"]>("ALL");
  const [ownerType, setOwnerType] = useState<(typeof ownerTypeOptions)[number]["value"]>("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProgressionRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ProgressionRecord | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filters = useMemo<ProgressionSearchFilters>(
    () => ({
      status: status === "ALL" ? undefined : status,
      type: type === "ALL" ? undefined : type,
      ownerType: ownerType === "ALL" ? undefined : ownerType,
    }),
    [ownerType, status, type],
  );

  const listQuery = useQuery({
    queryKey: [
      "progression",
      config.scope,
      page,
      REFERENCE_LIST_PAGE_SIZE,
      debouncedSearch,
      filters,
    ],
    queryFn: async () => {
      const result = await config.api.search({
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search: debouncedSearch,
        filters,
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
      title: isForbiddenMessage(listQuery.error.message)
        ? "Not permitted"
        : "Не удалось загрузить политики",
      description: listQuery.error.message,
    });
  }, [listQuery.error, listQuery.isError, pushToast]);

  const loadItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await config.api.get(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: (item) => {
      setSelectedItem(item);
      setIsDetailsOpen(true);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось открыть policy";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка загрузки",
        description: message,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateAdminProgressionPolicyPayload) => {
      if (!config.api.create) {
        throw new Error("Create operation is not supported");
      }

      const result = await config.api.create(payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Policy создана",
        description: "Новая политика прогрессии успешно сохранена.",
      });
      setIsCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось создать policy";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка создания",
        description: message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminProgressionPolicyPayload;
    }) => {
      if (!config.api.update) {
        throw new Error("Update operation is not supported");
      }

      const result = await config.api.update(id, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async (item) => {
      pushToast({
        kind: "success",
        title: "Policy обновлена",
        description: "Изменения сохранены.",
      });
      setSelectedItem(item);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось обновить policy";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка сохранения",
        description: message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!config.api.remove) {
        throw new Error("Delete operation is not supported");
      }

      const result = await config.api.remove(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Policy архивирована",
        description: "Политика удалена из активного списка.",
      });
      setDeleteItem(null);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось архивировать policy";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка удаления",
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
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <div className="flex w-full max-w-6xl items-center gap-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={config.searchPlaceholder}
            />
            <div className="w-[220px]">
              <AppSelect
                value={type}
                onValueChange={(value) => {
                  setType(value as (typeof typeOptions)[number]["value"]);
                  setPage(0);
                }}
                options={typeOptions}
                placeholder="Type"
              />
            </div>
            <div className="w-[180px]">
              <AppSelect
                value={status}
                onValueChange={(value) => {
                  setStatus(value as (typeof statusOptions)[number]["value"]);
                  setPage(0);
                }}
                options={statusOptions}
                placeholder="Status"
              />
            </div>
            {config.capabilities.canFilterOwnerType ? (
              <div className="w-[180px]">
                <AppSelect
                  value={ownerType}
                  onValueChange={(value) => {
                    setOwnerType(value as (typeof ownerTypeOptions)[number]["value"]);
                    setPage(0);
                  }}
                  options={ownerTypeOptions}
                  placeholder="Owner"
                />
              </div>
            ) : null}
            {config.capabilities.canCreate ? (
              <AppButton type="button" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {config.createButtonLabel}
              </AppButton>
            ) : null}
          </div>
        }
      />

      {listQuery.isLoading ? <LoadingState title="Загружаем progression policies..." /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить progression policies"
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && (listQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Policies не найдены"
          description={debouncedSearch ? "Измените поисковый запрос." : "Список пока пуст."}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data ? (
        <div className="space-y-4">
          <ProgressionTable
            items={listQuery.data.items}
            showOwnerColumns={config.capabilities.showOwnerColumns}
            canEdit={config.capabilities.canEdit}
            canDelete={config.capabilities.canDelete}
            onOpen={(item) => loadItemMutation.mutate(item.id)}
            onDelete={(item) => setDeleteItem(item)}
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
                onClick={() => setPage((previous) => previous - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                type="button"
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

      {config.capabilities.canCreate ? (
        <ProgressionFormDialog
          open={isCreateOpen}
          mode="create"
          isSubmitting={createMutation.isPending}
          onOpenChange={setIsCreateOpen}
          onSubmitCreate={async (payload) => {
            await createMutation.mutateAsync(payload);
          }}
          onSubmitUpdate={async () => {
            throw new Error("Unexpected update call in create mode");
          }}
        />
      ) : null}

      <ProgressionFormDialog
        open={isDetailsOpen}
        mode={config.capabilities.canEdit ? "edit" : "view"}
        item={selectedItem ?? undefined}
        isSubmitting={updateMutation.isPending}
        onOpenChange={setIsDetailsOpen}
        onSubmitCreate={async () => {
          throw new Error("Unexpected create call in details mode");
        }}
        onSubmitUpdate={async (id, payload) => {
          await updateMutation.mutateAsync({ id, payload });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteItem)}
        title="Архивировать policy?"
        description={
          deleteItem
            ? `Политика ${deleteItem.name} будет архивирована и станет недоступна в активном списке.`
            : ""
        }
        isSubmitting={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        onConfirm={() => {
          if (!deleteItem) {
            return;
          }

          void deleteMutation.mutateAsync(deleteItem.id);
        }}
      />
    </div>
  );
}
