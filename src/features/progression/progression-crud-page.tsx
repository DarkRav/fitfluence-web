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
import { ru } from "@/localization/ru";

type ProgressionCrudPageProps = {
  config: ProgressionScopeConfig;
};

const statusOptions: { value: "ALL" | AdminProgressionPolicyStatus; label: string }[] = [
  { value: "ALL", label: ru.progression.filters.allStatuses },
  { value: "ACTIVE", label: ru.progression.filters.active },
  { value: "ARCHIVED", label: ru.progression.filters.archived },
];

const typeOptions: { value: "ALL" | AdminProgressionPolicyType; label: string }[] = [
  { value: "ALL", label: ru.progression.filters.allTypes },
  { value: "DOUBLE_PROGRESSION", label: ru.progression.types.DOUBLE_PROGRESSION },
  { value: "LINEAR_LOAD", label: ru.progression.types.LINEAR_LOAD },
  { value: "RPE_BASED", label: ru.progression.types.RPE_BASED },
];

const ownerTypeOptions: { value: "ALL" | AdminProgressionPolicyOwnerType; label: string }[] = [
  { value: "ALL", label: ru.progression.filters.allOwners },
  { value: "ADMIN", label: ru.progression.filters.admin },
  { value: "INFLUENCER", label: ru.progression.filters.influencer },
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
        ? ru.common.states.notPermitted
        : ru.progression.loadError,
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
      const message = error instanceof Error ? error.message : ru.progression.openError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.progression.loadError,
        description: message,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateAdminProgressionPolicyPayload) => {
      if (!config.api.create) {
        throw new Error("Создание недоступно для текущей роли");
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
        title: ru.progression.createSuccessTitle,
        description: ru.progression.createSuccessDescription,
      });
      setIsCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.progression.createError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.progression.createError,
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
        throw new Error("Редактирование недоступно для текущей роли");
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
        title: ru.progression.updateSuccessTitle,
        description: ru.progression.updateSuccessDescription,
      });
      setSelectedItem(item);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.progression.updateError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.progression.updateError,
        description: message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!config.api.remove) {
        throw new Error("Архивация недоступна для текущей роли");
      }

      const result = await config.api.remove(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: ru.progression.archiveSuccessTitle,
        description: ru.progression.archiveSuccessDescription,
      });
      setDeleteItem(null);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.progression.archiveError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.progression.archiveError,
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
                placeholder={ru.progression.filters.typePlaceholder}
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
                placeholder={ru.progression.filters.statusPlaceholder}
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
                  placeholder={ru.progression.filters.ownerPlaceholder}
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

      {listQuery.isLoading ? <LoadingState title={ru.progression.loading} /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title={ru.progression.loadError}
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && (listQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title={ru.progression.emptyTitle}
          description={
            debouncedSearch
              ? ru.progression.emptyDescriptionSearch
              : ru.progression.emptyDescription
          }
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
              {ru.common.labels.page} {listQuery.data.page + 1} /{" "}
              {Math.max(listQuery.data.totalPages, 1)} • {listQuery.data.totalElements}{" "}
              {ru.common.labels.elements}
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={!hasPrev}
                onClick={() => setPage((previous) => previous - 1)}
              >
                {ru.common.actions.back}
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                disabled={!hasNext}
                onClick={() => setPage((previous) => previous + 1)}
              >
                {ru.common.actions.forward}
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
            throw new Error("Некорректный вызов обновления в режиме создания");
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
          throw new Error("Некорректный вызов создания в режиме деталей");
        }}
        onSubmitUpdate={async (id, payload) => {
          await updateMutation.mutateAsync({ id, payload });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteItem)}
        title={ru.progression.archiveConfirmTitle}
        description={
          deleteItem
            ? ru.progression.archiveConfirmDescription.replace("{name}", deleteItem.name)
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
