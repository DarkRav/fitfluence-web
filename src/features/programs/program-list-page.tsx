"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ProgramCreateDialog } from "@/features/programs/program-create-dialog";
import { ProgramsTable } from "@/features/programs/programs-table";
import type {
  ProgramCreatePayload,
  ProgramsPageResult,
  ProgramsScopeConfig,
} from "@/features/programs/types";
import { ru } from "@/localization/ru";
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

type ProgramListPageProps = {
  config: ProgramsScopeConfig;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

const statusFilterOptions = [
  { value: "ALL", label: ru.common.status.ALL },
  { value: "DRAFT", label: ru.common.status.DRAFT },
  { value: "PUBLISHED", label: ru.common.status.PUBLISHED },
  { value: "ARCHIVED", label: ru.common.status.ARCHIVED },
] as const;

export function ProgramListPage({ config }: ProgramListPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilterOptions)[number]["value"]>("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const listQuery = useQuery<ProgramsPageResult, Error>({
    queryKey: [
      ...config.queryKeyPrefix,
      page,
      REFERENCE_LIST_PAGE_SIZE,
      debouncedSearch,
      { status: statusFilter },
    ],
    queryFn: async () => {
      const result = await config.api.search({
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter === "ALL" ? undefined : statusFilter,
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
        : ru.programs.page.loadError,
      description: listQuery.error.message,
    });
  }, [listQuery.error, listQuery.isError, pushToast]);

  const createMutation = useMutation({
    mutationFn: async (payload: ProgramCreatePayload) => {
      if (!config.api.create) {
        throw new Error("Create operation is not supported");
      }

      const result = await config.api.create(payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async (program) => {
      pushToast({
        kind: "success",
        title: ru.programs.page.createSuccessTitle,
        description: ru.programs.page.createSuccessDescription,
      });
      setIsCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix });
      router.push(config.routes.details(program.id));
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.page.createError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.page.createError,
        description: message,
      });
    },
  });

  const totalPages = listQuery.data?.totalPages ?? 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;
  const hasItems = (listQuery.data?.items.length ?? 0) > 0;

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <div className="flex w-full flex-wrap items-center gap-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={config.searchPlaceholder}
            />
            {config.capabilities.enableStatusFilter ? (
              <div className="w-[190px]">
                <AppSelect
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value as (typeof statusFilterOptions)[number]["value"]);
                    setPage(0);
                  }}
                  options={statusFilterOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder={ru.common.labels.status}
                />
              </div>
            ) : null}
            {config.capabilities.canCreate ? (
              <AppButton
                type="button"
                onClick={() => setIsCreateOpen(true)}
                disabled={createMutation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                {config.createButtonLabel}
              </AppButton>
            ) : null}
          </div>
        }
      />

      {listQuery.isLoading ? <LoadingState title={ru.programs.page.loading} /> : null}

      {!listQuery.isLoading && listQuery.isError ? (
        <ErrorState
          title={ru.programs.page.loadError}
          description={listQuery.error.message}
          onRetry={() => void listQuery.refetch()}
        />
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && !hasItems ? (
        <div className="mt-4">
          <EmptyState
            title={ru.programs.page.emptyTitle}
            description={
              search ? ru.programs.page.emptyDescriptionSearch : ru.programs.page.emptyDescription
            }
          />
        </div>
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && listQuery.data && hasItems ? (
        <div className="space-y-4">
          <ProgramsTable
            items={listQuery.data.items}
            showOwner={config.capabilities.showOwner}
            onOpen={(item) => router.push(config.routes.details(item.id))}
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

      {config.capabilities.canCreate ? (
        <ProgramCreateDialog
          open={isCreateOpen}
          isSubmitting={createMutation.isPending}
          requireInfluencerId={config.scope === "admin"}
          onOpenChange={setIsCreateOpen}
          onSubmit={async (payload) => {
            await createMutation.mutateAsync(payload);
          }}
        />
      ) : null}
    </div>
  );
}
