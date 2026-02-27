"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgramForm } from "@/features/programs/program-form";
import { ProgramHeader } from "@/features/programs/program-header";
import { PublishVersionDialog } from "@/features/programs/publish-version-dialog";
import { ProgramTabs, type ProgramTabId } from "@/features/programs/program-tabs";
import { ProgramVersionsTab } from "@/features/programs/program-versions-tab";
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
import { ru } from "@/localization/ru";
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
  { value: "ALL", label: ru.common.status.ALL },
  { value: "DRAFT", label: ru.common.status.DRAFT },
  { value: "PUBLISHED", label: ru.common.status.PUBLISHED },
  { value: "ARCHIVED", label: ru.common.status.ARCHIVED },
] as const;

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

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
  const [publishTarget, setPublishTarget] = useState<ProgramVersionRecord | null>(null);

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

  useEffect(() => {
    if (!detailsQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: isForbiddenMessage(detailsQuery.error.message)
        ? ru.common.states.notPermitted
        : ru.programs.details.loadError,
      description: detailsQuery.error.message,
    });
  }, [detailsQuery.error, detailsQuery.isError, pushToast]);

  const updateMutation = useMutation({
    mutationFn: async (payload: ProgramUpdatePayload) => {
      if (!config.api.update) {
        throw new Error(ru.programs.details.updateNotSupported);
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
        title: ru.programs.details.saveSuccessTitle,
        description: ru.programs.details.saveSuccessDescription,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...config.queryKeyPrefix, "details", programId],
        }),
        queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix }),
      ]);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.details.saveError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.details.saveError,
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
        throw new Error(ru.programs.details.versionsApiUnavailable);
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

  const publishMutation = useMutation({
    mutationFn: async (programVersionId: string) => {
      if (!config.api.publishVersion) {
        throw new Error(ru.programs.details.publishNotSupported);
      }

      const result = await config.api.publishVersion(programVersionId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      setPublishTarget(null);
      pushToast({
        kind: "success",
        title: ru.programs.details.publishSuccessTitle,
        description: ru.programs.details.publishSuccessDescription,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...config.queryKeyPrefix, "versions", programId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...config.queryKeyPrefix, "details", programId],
        }),
        queryClient.invalidateQueries({ queryKey: config.queryKeyPrefix }),
      ]);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.programs.details.publishError;
      pushToast({
        kind: "error",
        title: isForbiddenMessage(message)
          ? ru.common.states.notPermitted
          : ru.programs.details.publishError,
        description: message,
      });
    },
  });

  if (detailsQuery.isLoading) {
    return <LoadingState title={ru.programs.details.loading} />;
  }

  if (detailsQuery.isError) {
    return (
      <ErrorState
        title={ru.programs.details.loadError}
        description={detailsQuery.error.message}
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  const program = detailsQuery.data;
  if (!program) {
    return (
      <ErrorState
        title={ru.programs.details.loadError}
        description={ru.programs.details.emptyServer}
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
          <div className="flex items-center gap-2">
            {config.scope === "influencer" && program.currentPublishedVersionId ? (
              <AppButton
                type="button"
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/influencer/workouts?programId=${program.id}&programVersionId=${program.currentPublishedVersionId}`,
                  )
                }
              >
                {ru.programs.versions.table.openWorkouts}
              </AppButton>
            ) : null}
            <AppButton
              type="button"
              variant="ghost"
              onClick={() => router.push(config.routes.list)}
            >
              {ru.common.labels.programs}
            </AppButton>
          </div>
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
            submitLabel={ru.common.actions.save}
            onSubmit={async (payload) => {
              await updateMutation.mutateAsync(payload);
            }}
          />
        ) : activeTab === "details" ? (
          <div className="rounded-xl border border-border bg-sidebar/40 p-6">
            <p className="text-sm font-medium text-foreground">
              {ru.programs.details.readOnlyTitle}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {ru.programs.details.readOnlyDescription}
            </p>
          </div>
        ) : config.capabilities.showVersions && config.scope === "influencer" ? (
          <ProgramVersionsTab programId={programId} config={config} />
        ) : config.capabilities.showVersions ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AppInput
                value={versionsSearch}
                onChange={(event) => setVersionsSearch(event.target.value)}
                placeholder={ru.common.placeholders.searchVersions}
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
                  placeholder={ru.common.labels.status}
                />
              </div>
            </div>

            {versionsQuery.isLoading ? <LoadingState title={ru.programs.versions.loading} /> : null}

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
                <VersionsTable
                  items={versionsQuery.data.items}
                  canPublish={config.capabilities.canPublish}
                  isPublishing={publishMutation.isPending}
                  onOpenWorkouts={
                    config.scope === "admin"
                      ? (version) => {
                          router.push(
                            `/admin/programs/${program.id}/versions/${version.id}/workouts`,
                          );
                        }
                      : undefined
                  }
                  onPublish={(version: ProgramVersionRecord) => {
                    setPublishTarget(version);
                  }}
                />
                <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
                  <p className="text-muted-foreground">
                    {ru.common.labels.page} {versionsQuery.data.page + 1} /{" "}
                    {Math.max(versionsQuery.data.totalPages, 1)} •{" "}
                    {versionsQuery.data.totalElements} {ru.common.labels.elements}
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
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-sidebar/40 p-6">
            <p className="text-sm font-medium text-foreground">
              {ru.programs.details.versionsUnavailable}
            </p>
          </div>
        )}
      </div>

      <PublishVersionDialog
        open={Boolean(publishTarget)}
        version={publishTarget}
        isSubmitting={publishMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setPublishTarget(null);
          }
        }}
        onConfirm={async () => {
          if (!publishTarget) {
            return;
          }

          await publishMutation.mutateAsync(publishTarget.id);
        }}
      />
    </div>
  );
}
