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
import { ru } from "@/localization/ru";

const statusFilterOptions = [
  { value: "ALL", label: ru.common.status.ALL },
  { value: "DRAFT", label: ru.common.status.DRAFT },
  { value: "PUBLISHED", label: ru.common.status.PUBLISHED },
  { value: "ARCHIVED", label: ru.common.status.ARCHIVED },
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
        throw new Error(ru.programs.versions.apiUnavailable);
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
        ? ru.common.states.notPermitted
        : ru.programs.versions.loadError,
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
        throw new Error(ru.programs.details.createNotSupported);
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
        title: ru.programs.versions.createSuccess,
        description: ru.common.status.DRAFT,
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.versions.createError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.versions.createError,
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
        throw new Error(ru.programs.details.updateVersionNotSupported);
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
        title: ru.programs.versions.updateSuccess,
        description: ru.programs.versions.updateSuccess,
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.versions.updateError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.versions.updateError,
        description: message,
      });
    },
  });

  const archiveVersionMutation = useMutation({
    mutationFn: async (programVersionId: string) => {
      if (!config.api.deleteVersion) {
        throw new Error(ru.programs.details.archiveNotSupported);
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
        title: ru.programs.versions.archiveSuccess,
        description: ru.common.status.ARCHIVED,
      });
      await queryClient.invalidateQueries({
        queryKey: ["influencerProgramVersions", programId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.versions.archiveError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.versions.archiveError,
        description: message,
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div>
          <AppInput
            className="w-full sm:w-[320px]"
            value={versionsSearch}
            onChange={(event) => setVersionsSearch(event.target.value)}
            placeholder={ru.common.placeholders.searchVersions}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
              placeholder={ru.common.labels.status}
            />
          </div>
          <AppButton
            type="button"
            disabled={!config.api.createVersion}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            {ru.programs.versions.createVersion}
          </AppButton>
        </div>
      </div>

      <div className="rounded-xl border border-secondary/35 bg-secondary/10 px-4 py-3 text-sm text-secondary">
        {ru.programs.publishByAdmin}
      </div>

      {versionsQuery.isLoading ? <LoadingState title={ru.programs.versions.loadError} /> : null}

      {!versionsQuery.isLoading && versionsQuery.isError ? (
        <ErrorState
          title={ru.programs.versions.loadError}
          description={versionsQuery.error.message}
          onRetry={() => void versionsQuery.refetch()}
        />
      ) : null}

      {!versionsQuery.isLoading &&
      !versionsQuery.isError &&
      (versionsQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title={ru.programs.versions.emptyTitle}
          description={ru.programs.versions.emptyDescription}
        />
      ) : null}

      {!versionsQuery.isLoading && !versionsQuery.isError && versionsQuery.data ? (
        <div className="space-y-4">
          <ProgramVersionsTable
            items={versionsQuery.data.items}
            onEdit={setEditingVersion}
            onArchive={setArchivingVersion}
            onOpenWorkouts={(item) =>
              router.push(
                `/influencer/programs/${encodeURIComponent(programId)}?tab=workouts&version=${encodeURIComponent(item.id)}`,
              )
            }
          />
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-muted-foreground">
              {ru.common.labels.page} {versionsQuery.data.page + 1} /{" "}
              {Math.max(versionsQuery.data.totalPages, 1)} • {versionsQuery.data.totalElements}{" "}
              {ru.common.labels.elements}
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={versionsPage === 0}
                onClick={() => setVersionsPage((prev) => prev - 1)}
              >
                {ru.common.actions.back}
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                disabled={versionsPage + 1 >= (versionsQuery.data.totalPages ?? 0)}
                onClick={() => setVersionsPage((prev) => prev + 1)}
              >
                {ru.common.actions.forward}
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
        title={ru.programs.versions.archiveConfirmTitle}
        description={ru.programs.versions.archiveConfirmDescription}
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
