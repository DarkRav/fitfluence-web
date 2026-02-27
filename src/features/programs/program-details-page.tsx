"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgramForm } from "@/features/programs/program-form";
import { ProgramHeader } from "@/features/programs/program-header";
import { ProgramTabs, type ProgramTabId } from "@/features/programs/program-tabs";
import { VersionsTable } from "@/features/programs/versions-table";
import {
  AppButton,
  AppInput,
  AppSelect,
  EmptyState,
  ErrorState,
  LoadingState,
  useAppToast,
} from "@/shared/ui";
import type {
  ProgramVersionRecord,
  ProgramRecord,
  ProgramUpdatePayload,
  ProgramVersionsPageResult,
  ProgramsScopeConfig,
} from "@/features/programs/types";

type ProgramDetailsPageProps = {
  programId: string;
  config: ProgramsScopeConfig;
};

const statusFilterOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "PUBLISHED", label: "PUBLISHED" },
  { value: "ARCHIVED", label: "ARCHIVED" },
] as const;

export function ProgramDetailsPage({ programId, config }: ProgramDetailsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<ProgramTabId>("details");
  const [versionsSearch, setVersionsSearch] = useState("");
  const [debouncedVersionsSearch, setDebouncedVersionsSearch] = useState("");
  const [versionsPage, setVersionsPage] = useState(0);
  const [versionsStatusFilter, setVersionsStatusFilter] =
    useState<(typeof statusFilterOptions)[number]["value"]>("ALL");

  const detailsQuery = useQuery<ProgramRecord, Error>({
    queryKey: [...config.queryKeyPrefix, "details", programId],
    queryFn: async () => {
      const result = await config.api.get(programId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: ProgramUpdatePayload) => {
      if (!config.api.update) {
        throw new Error("Update operation is not supported");
      }

      const result = await config.api.update(programId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Программа сохранена",
        description: "Изменения метаданных успешно применены.",
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...config.queryKeyPrefix, "details", programId],
        }),
        queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix }),
      ]);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось сохранить изменения";
      pushToast({
        kind: "error",
        title: "Ошибка сохранения",
        description: message,
      });
    },
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedVersionsSearch(versionsSearch);
      setVersionsPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [versionsSearch]);

  const versionsQuery = useQuery<ProgramVersionsPageResult, Error>({
    queryKey: [
      ...config.queryKeyPrefix,
      "versions",
      programId,
      versionsPage,
      debouncedVersionsSearch,
      { status: versionsStatusFilter },
    ],
    enabled: activeTab === "versions" && Boolean(config.api.searchVersions),
    queryFn: async () => {
      if (!config.api.searchVersions) {
        throw new Error("Versions API is not available");
      }

      const result = await config.api.searchVersions({
        programId,
        page: versionsPage,
        size: 20,
        search: debouncedVersionsSearch,
        status: versionsStatusFilter === "ALL" ? undefined : versionsStatusFilter,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  useEffect(() => {
    if (!versionsQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: "Не удалось загрузить версии",
      description: versionsQuery.error.message,
    });
  }, [pushToast, versionsQuery.error, versionsQuery.isError]);

  if (detailsQuery.isLoading) {
    return <LoadingState title="Загружаем программу..." />;
  }

  if (detailsQuery.isError) {
    return (
      <ErrorState
        title="Не удалось загрузить программу"
        description={detailsQuery.error.message}
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  const program = detailsQuery.data;
  if (!program) {
    return (
      <ErrorState
        title="Не удалось загрузить программу"
        description="Пустой ответ от сервера."
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProgramHeader program={program} onBack={() => router.push(config.routes.list)} />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <ProgramTabs activeTab={activeTab} onChange={setActiveTab} />
          <AppButton type="button" variant="ghost" onClick={() => router.push(config.routes.list)}>
            Back to Programs
          </AppButton>
        </div>

        {activeTab === "details" && config.capabilities.canEdit && config.api.update ? (
          <ProgramForm
            mode="edit"
            initialValues={{
              title: program.title,
              description: program.description ?? "",
              goals: program.goals,
              coverMediaId: program.coverMediaId ?? "",
              status: program.status,
            }}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save"
            onSubmit={async (payload) => {
              await updateMutation.mutateAsync(payload);
            }}
          />
        ) : activeTab === "details" ? (
          <div className="rounded-xl border border-border bg-sidebar/40 p-6">
            <p className="text-sm font-medium text-foreground">Program details</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Редактирование недоступно для текущего scope.
            </p>
          </div>
        ) : config.capabilities.showVersions ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AppInput
                value={versionsSearch}
                onChange={(event) => setVersionsSearch(event.target.value)}
                placeholder="Search versions"
              />
              <div className="w-[190px]">
                <AppSelect
                  value={versionsStatusFilter}
                  onValueChange={(value) => {
                    setVersionsStatusFilter(value as (typeof statusFilterOptions)[number]["value"]);
                    setVersionsPage(0);
                  }}
                  options={statusFilterOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder="Status"
                />
              </div>
            </div>

            {versionsQuery.isLoading ? <LoadingState title="Загружаем версии..." /> : null}

            {!versionsQuery.isLoading && versionsQuery.isError ? (
              <ErrorState
                title="Не удалось загрузить версии"
                description={versionsQuery.error.message}
                onRetry={() => void versionsQuery.refetch()}
              />
            ) : null}

            {!versionsQuery.isLoading &&
            !versionsQuery.isError &&
            (versionsQuery.data?.items.length ?? 0) === 0 ? (
              <EmptyState title="Версии не найдены" description="Попробуйте изменить фильтры." />
            ) : null}

            {!versionsQuery.isLoading && !versionsQuery.isError && versionsQuery.data ? (
              <div className="space-y-4">
                <VersionsTable
                  items={versionsQuery.data.items}
                  canPublish={config.capabilities.canPublish}
                  isPublishing={false}
                  onPublish={(version: ProgramVersionRecord) => {
                    void version;
                  }}
                />
                <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
                  <p className="text-muted-foreground">
                    Страница {versionsQuery.data.page + 1} /{" "}
                    {Math.max(versionsQuery.data.totalPages, 1)} •{" "}
                    {versionsQuery.data.totalElements} элементов
                  </p>
                  <div className="flex items-center gap-2">
                    <AppButton
                      type="button"
                      variant="secondary"
                      disabled={versionsPage === 0}
                      onClick={() => setVersionsPage((prev) => prev - 1)}
                    >
                      Назад
                    </AppButton>
                    <AppButton
                      type="button"
                      variant="secondary"
                      disabled={versionsPage + 1 >= (versionsQuery.data.totalPages ?? 0)}
                      onClick={() => setVersionsPage((prev) => prev + 1)}
                    >
                      Вперед
                    </AppButton>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-sidebar/40 p-6">
            <p className="text-sm font-medium text-foreground">Versions are not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
