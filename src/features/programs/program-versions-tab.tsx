"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgramVersionsTable } from "@/features/programs/program-versions-table";
import {
  AppButton,
  AppInput,
  AppSelect,
  EmptyState,
  ErrorState,
  LoadingState,
  useAppToast,
} from "@/shared/ui";
import type { ProgramVersionsPageResult, ProgramsScopeConfig } from "@/features/programs/types";

const statusFilterOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "PUBLISHED", label: "PUBLISHED" },
  { value: "ARCHIVED", label: "ARCHIVED" },
] as const;

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

type ProgramVersionsTabProps = {
  programId: string;
  config: ProgramsScopeConfig;
};

export function ProgramVersionsTab({ programId, config }: ProgramVersionsTabProps) {
  const { pushToast } = useAppToast();
  const [versionsSearch, setVersionsSearch] = useState("");
  const [debouncedVersionsSearch, setDebouncedVersionsSearch] = useState("");
  const [versionsPage, setVersionsPage] = useState(0);
  const [versionsStatusFilter, setVersionsStatusFilter] =
    useState<(typeof statusFilterOptions)[number]["value"]>("ALL");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedVersionsSearch(versionsSearch);
      setVersionsPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [versionsSearch]);

  const versionsQuery = useQuery<ProgramVersionsPageResult, Error>({
    queryKey: [
      "influencerProgramVersions",
      programId,
      versionsPage,
      20,
      debouncedVersionsSearch,
      { status: versionsStatusFilter },
    ],
    enabled: Boolean(config.api.searchVersions),
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
      title: isForbiddenMessage(versionsQuery.error.message)
        ? "Not permitted"
        : "Не удалось загрузить версии",
      description: versionsQuery.error.message,
    });
  }, [pushToast, versionsQuery.error, versionsQuery.isError]);

  return (
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
          <ProgramVersionsTable items={versionsQuery.data.items} />
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              Страница {versionsQuery.data.page + 1} / {Math.max(versionsQuery.data.totalPages, 1)}{" "}
              • {versionsQuery.data.totalElements} элементов
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
  );
}
