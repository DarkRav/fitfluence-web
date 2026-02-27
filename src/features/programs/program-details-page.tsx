"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgramForm } from "@/features/programs/program-form";
import { ProgramHeader } from "@/features/programs/program-header";
import { ProgramPageLayout } from "@/features/programs/program-page-layout";
import { PublishVersionDialog } from "@/features/programs/publish-version-dialog";
import { ProgramVersionFormDialog } from "@/features/programs/program-version-form-dialog";
import { type ProgramTopTabId } from "@/features/programs/program-tabs";
import { VersionPicker } from "@/features/programs/version-picker";
import type {
  ProgramRecord,
  ProgramUpdatePayload,
  ProgramVersionRecord,
  ProgramVersionsPageResult,
  ProgramsScopeConfig,
} from "@/features/programs/types";
import { WorkoutsListPage } from "@/features/workouts/workouts-list-page";
import { ru } from "@/localization/ru";
import { AppButton, EmptyState, ErrorState, LoadingState, useAppToast } from "@/shared/ui";

type ProgramDetailsPageProps = {
  programId: string;
  config: ProgramsScopeConfig;
};

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

function parseTab(value: string | null): ProgramTopTabId {
  if (value === "workouts" || value === "info") {
    return value;
  }

  return "info";
}

function pickPreferredVersion(versions: ProgramVersionRecord[]): ProgramVersionRecord | undefined {
  if (versions.length === 0) {
    return undefined;
  }

  return (
    versions.find((item) => item.status === "DRAFT") ??
    versions.find((item) => item.status === "PUBLISHED") ??
    versions[0]
  );
}

export function ProgramDetailsPage({ programId, config }: ProgramDetailsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [publishTarget, setPublishTarget] = useState<ProgramVersionRecord | null>(null);
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);

  const activeTab = parseTab(searchParams.get("tab"));
  const queryVersionId = searchParams.get("version");

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

  const versionsQuery = useQuery<ProgramVersionsPageResult, Error>({
    queryKey: [...config.queryKeyPrefix, "versions-picker", programId],
    enabled: Boolean(config.api.searchVersions),
    queryFn: async () => {
      if (!config.api.searchVersions) {
        throw new Error(ru.programs.details.versionsApiUnavailable);
      }

      const result = await config.api.searchVersions({
        programId,
        page: 0,
        size: 200,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return {
        ...result.data,
        items: [...result.data.items].sort(
          (left, right) => right.versionNumber - left.versionNumber,
        ),
      };
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

  const versions = useMemo(() => versionsQuery.data?.items ?? [], [versionsQuery.data?.items]);

  const selectedVersionId = useMemo(() => {
    if (versions.length === 0) {
      return undefined;
    }

    if (queryVersionId && versions.some((item) => item.id === queryVersionId)) {
      return queryVersionId;
    }

    return pickPreferredVersion(versions)?.id;
  }, [queryVersionId, versions]);

  const selectedVersion = useMemo(
    () => versions.find((item) => item.id === selectedVersionId),
    [selectedVersionId, versions],
  );

  const replaceQuery = useCallback(
    (updates: { tab?: ProgramTopTabId; version?: string }) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (updates.tab) {
        nextParams.set("tab", updates.tab);
      }
      if (updates.version) {
        nextParams.set("version", updates.version);
      }

      router.replace(`${pathname}?${nextParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (!selectedVersionId || selectedVersionId === queryVersionId) {
      return;
    }

    replaceQuery({ version: selectedVersionId, tab: activeTab });
  }, [activeTab, queryVersionId, replaceQuery, selectedVersionId]);

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
    onSuccess: async (version) => {
      setIsCreateVersionOpen(false);
      pushToast({
        kind: "success",
        title: ru.programs.versions.createSuccess,
        description: ru.common.status.DRAFT,
      });
      await queryClient.invalidateQueries({
        queryKey: [...config.queryKeyPrefix, "versions-picker", programId],
      });
      replaceQuery({ tab: "workouts", version: version.id });
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
          queryKey: [...config.queryKeyPrefix, "versions-picker", programId],
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
    <>
      <ProgramPageLayout
        header={
          <ProgramHeader
            program={program}
            onBack={() => router.push(config.routes.list)}
            controls={
              <>
                <VersionPicker
                  versions={versions}
                  selectedVersionId={selectedVersionId}
                  onChange={(versionId) => replaceQuery({ version: versionId, tab: activeTab })}
                  onCreate={
                    config.scope === "influencer" && config.api.createVersion
                      ? () => setIsCreateVersionOpen(true)
                      : undefined
                  }
                  isCreating={createVersionMutation.isPending}
                  disabled={versionsQuery.isLoading || versionsQuery.isError}
                />
                {config.capabilities.canPublish && selectedVersion?.status === "DRAFT" ? (
                  <AppButton
                    type="button"
                    disabled={publishMutation.isPending}
                    onClick={() => setPublishTarget(selectedVersion)}
                  >
                    {ru.common.actions.publish}
                  </AppButton>
                ) : null}
              </>
            }
          />
        }
        tabs={{
          active: activeTab,
          onChange: (tab) => replaceQuery({ tab, version: selectedVersionId }),
        }}
        content={
          activeTab === "info" ? (
            config.capabilities.canEdit && config.api.update ? (
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
            ) : (
              <div className="rounded-xl border border-border bg-sidebar/40 p-6">
                <p className="text-sm font-medium text-foreground">
                  {ru.programs.details.readOnlyTitle}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ru.programs.details.readOnlyDescription}
                </p>
              </div>
            )
          ) : activeTab === "workouts" ? (
            versionsQuery.isLoading ? (
              <LoadingState title={ru.programs.versions.loading} />
            ) : versionsQuery.isError ? (
              <ErrorState
                title={ru.programs.versions.loadError}
                description={versionsQuery.error.message}
                onRetry={() => void versionsQuery.refetch()}
              />
            ) : selectedVersionId ? (
              <WorkoutsListPage
                programId={programId}
                programVersionId={selectedVersionId}
                scopeName={config.scope}
                embedded
                canManage={config.scope === "influencer"}
              />
            ) : (
              <EmptyState
                title={ru.programs.versionPicker.noVersionsTitle}
                description={ru.programs.versionPicker.noVersionsDescription}
              />
            )
          ) : null
        }
      />

      <ProgramVersionFormDialog
        open={isCreateVersionOpen}
        mode="create"
        isSubmitting={createVersionMutation.isPending}
        onOpenChange={setIsCreateVersionOpen}
        onCreate={async (payload) => {
          await createVersionMutation.mutateAsync(payload);
        }}
      />

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
    </>
  );
}
