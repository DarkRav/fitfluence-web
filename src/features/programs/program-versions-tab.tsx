"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmDeleteDialog } from "@/features/reference/confirm-delete-dialog";
import { ProgramVersionFormDialog } from "@/features/programs/program-version-form-dialog";
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
import type {
  ProgramVersionRecord,
  ProgramVersionsPageResult,
  ProgramsScopeConfig,
} from "@/features/programs/types";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [versionsSearch, setVersionsSearch] = useState("");
  const [debouncedVersionsSearch, setDebouncedVersionsSearch] = useState("");
  const [versionsPage, setVersionsPage] = useState(0);
  const [versionsStatusFilter, setVersionsStatusFilter] =
    useState<(typeof statusFilterOptions)[number]["value"]>("ALL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<ProgramVersionRecord | null>(null);
  const [archivingVersion, setArchivingVersion] = useState<ProgramVersionRecord | null>(null);

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

  const createVersionMutation = useMutation({
    mutationFn: async (payload: {
      versionNumber: number;
      level?: string;
      frequencyPerWeek?: number;
    }) => {
      if (!config.api.createVersion) {
        throw new Error("Create version operation is not supported");
      }

      const result = await config.api.createVersion(programId, payload);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      setIsCreateDialogOpen(false);
      pushToast({
        kind: "success",
        title: "Версия создана",
        description: "Новая версия программы добавлена в статусе DRAFT.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось создать версию";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка создания",
        description: message,
      });
    },
  });

  const updateVersionMutation = useMutation({
    mutationFn: async (payload: {
      programVersionId: string;
      level?: string;
      frequencyPerWeek?: number;
    }) => {
      if (!config.api.updateVersion) {
        throw new Error("Update version operation is not supported");
      }

      const result = await config.api.updateVersion(payload.programVersionId, {
        level: payload.level,
        frequencyPerWeek: payload.frequencyPerWeek,
      });
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      setEditingVersion(null);
      pushToast({
        kind: "success",
        title: "Версия обновлена",
        description: "Изменения метаданных версии сохранены.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось обновить версию";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка сохранения",
        description: message,
      });
    },
  });

  const archiveVersionMutation = useMutation({
    mutationFn: async (programVersionId: string) => {
      if (!config.api.deleteVersion) {
        throw new Error("Archive version operation is not supported");
      }

      const result = await config.api.deleteVersion(programVersionId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      setArchivingVersion(null);
      pushToast({
        kind: "success",
        title: "Версия архивирована",
        description: "Версия переведена в статус ARCHIVED.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось архивировать версию";
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message) ? "Not permitted" : "Ошибка архивации",
        description: message,
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
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
        <AppButton
          type="button"
          disabled={!config.api.createVersion}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create version
        </AppButton>
      </div>

      <div className="rounded-xl border border-secondary/35 bg-secondary/10 px-4 py-3 text-sm text-secondary">
        Publishing is performed by Admin.
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
          <ProgramVersionsTable
            items={versionsQuery.data.items}
            onEdit={setEditingVersion}
            onArchive={setArchivingVersion}
            onOpenWorkouts={(item) =>
              router.push(`/influencer/workouts?programId=${programId}&programVersionId=${item.id}`)
            }
          />
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

      <ProgramVersionFormDialog
        open={isCreateDialogOpen}
        mode="create"
        isSubmitting={createVersionMutation.isPending}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (payload) => {
          await createVersionMutation.mutateAsync(payload);
        }}
      />

      <ProgramVersionFormDialog
        open={Boolean(editingVersion)}
        mode="edit"
        version={editingVersion ?? undefined}
        isSubmitting={updateVersionMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditingVersion(null);
          }
        }}
        onUpdate={async (programVersionId, payload) => {
          await updateVersionMutation.mutateAsync({
            programVersionId,
            level: payload.level,
            frequencyPerWeek: payload.frequencyPerWeek,
          });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(archivingVersion)}
        title="Archive version"
        description="Version will be moved to ARCHIVED status. This action cannot be undone from this screen."
        isSubmitting={archiveVersionMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setArchivingVersion(null);
          }
        }}
        onConfirm={() => {
          if (!archivingVersion) {
            return;
          }
          void archiveVersionMutation.mutateAsync(archivingVersion.id);
        }}
      />
    </div>
  );
}
