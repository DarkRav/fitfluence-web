"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchInfluencerPrograms } from "@/api/influencerPrograms";
import { searchInfluencerProgramVersions } from "@/api/influencerProgramVersions";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { WorkoutsListPage } from "@/features/workouts/workouts-list-page";
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

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

export function InfluencerWorkoutsHubPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState(searchParams.get("programId") ?? "");
  const [selectedProgramVersionId, setSelectedProgramVersionId] = useState(
    searchParams.get("programVersionId") ?? "",
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedProgramId) {
      params.set("programId", selectedProgramId);
    }
    if (selectedProgramVersionId) {
      params.set("programVersionId", selectedProgramVersionId);
    }
    const query = params.toString();
    const nextUrl = query ? `/influencer/workouts?${query}` : "/influencer/workouts";
    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery
      ? `/influencer/workouts?${currentQuery}`
      : "/influencer/workouts";

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl);
    }
  }, [router, searchParams, selectedProgramId, selectedProgramVersionId]);

  const programsQuery = useQuery({
    queryKey: ["influencerWorkoutsHub", page, REFERENCE_LIST_PAGE_SIZE, debouncedSearch],
    queryFn: async () => {
      const result = await searchInfluencerPrograms({
        page,
        size: REFERENCE_LIST_PAGE_SIZE,
        search: debouncedSearch,
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: REFERENCE_LIST_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
  });

  const versionsQuery = useQuery({
    queryKey: ["influencerWorkoutsVersions", selectedProgramId],
    enabled: Boolean(selectedProgramId),
    queryFn: async () => {
      const result = await searchInfluencerProgramVersions({
        programId: selectedProgramId,
        page: 0,
        size: 100,
      });
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  useEffect(() => {
    if (!programsQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: isForbiddenMessage(programsQuery.error.message)
        ? ru.common.states.notPermitted
        : ru.programs.page.loadError,
      description: programsQuery.error.message,
    });
  }, [programsQuery.error, programsQuery.isError, pushToast]);

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

  const programOptions = useMemo(
    () =>
      (programsQuery.data?.items ?? []).map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [programsQuery.data?.items],
  );

  const versionOptions = useMemo(
    () =>
      (versionsQuery.data?.items ?? []).map((version) => ({
        value: version.id,
        label: `v${version.versionNumber} · ${version.status}`,
      })),
    [versionsQuery.data?.items],
  );

  const totalPages = programsQuery.data?.totalPages ?? 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title={ru.workouts.title}
        subtitle={ru.workouts.hubSubtitle}
        actions={
          <div className="grid w-full gap-2">
            <AppInput
              className="w-full sm:w-[320px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={ru.common.placeholders.searchPrograms}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[250px] flex-1">
                <AppSelect
                  value={selectedProgramId}
                  onValueChange={(value) => {
                    setSelectedProgramId(value);
                    setSelectedProgramVersionId("");
                  }}
                  options={programOptions}
                  placeholder={ru.common.placeholders.selectProgram}
                />
              </div>
              <div className="min-w-[250px] flex-1">
                <AppSelect
                  value={selectedProgramVersionId}
                  onValueChange={setSelectedProgramVersionId}
                  options={versionOptions}
                  placeholder={
                    selectedProgramId
                      ? ru.common.placeholders.selectVersion
                      : ru.common.placeholders.selectProgramFirst
                  }
                />
              </div>
              <AppButton
                type="button"
                variant="secondary"
                onClick={() => router.push("/influencer/programs")}
              >
                {ru.common.labels.programs}
              </AppButton>
            </div>
          </div>
        }
      />

      {programsQuery.isLoading ? <LoadingState title={ru.workouts.loadingPrograms} /> : null}

      {!programsQuery.isLoading && programsQuery.isError ? (
        <ErrorState
          title={ru.workouts.loadProgramsError}
          description={programsQuery.error.message}
          onRetry={() => void programsQuery.refetch()}
        />
      ) : null}

      {!programsQuery.isLoading &&
      !programsQuery.isError &&
      (programsQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState title={ru.programs.page.emptyTitle} description={ru.workouts.emptySearchHint} />
      ) : null}

      {!programsQuery.isLoading &&
      !programsQuery.isError &&
      !selectedProgramId &&
      (programsQuery.data?.items.length ?? 0) > 0 ? (
        <EmptyState
          title={ru.workouts.selectProgramTitle}
          description={ru.workouts.selectProgramDescription}
        />
      ) : null}

      {!programsQuery.isLoading &&
      !programsQuery.isError &&
      selectedProgramId &&
      !selectedProgramVersionId ? (
        <EmptyState
          title={ru.workouts.selectVersionTitle}
          description={ru.workouts.selectVersionDescription}
        />
      ) : null}

      {selectedProgramId && selectedProgramVersionId ? (
        <WorkoutsListPage
          programId={selectedProgramId}
          programVersionId={selectedProgramVersionId}
          scopeName="influencer"
        />
      ) : null}

      {programsQuery.data && programsQuery.data.totalPages > 1 ? (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
          <p className="text-muted-foreground">
            {ru.common.labels.page} {programsQuery.data.page + 1} / {Math.max(totalPages, 1)} •{" "}
            {programsQuery.data.totalElements} {ru.common.labels.elements}
          </p>
          <div className="flex items-center gap-2">
            <AppButton
              type="button"
              variant="secondary"
              disabled={page === 0}
              onClick={() => setPage((previous) => previous - 1)}
            >
              {ru.common.actions.back}
            </AppButton>
            <AppButton
              type="button"
              variant="secondary"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((previous) => previous + 1)}
            >
              {ru.common.actions.forward}
            </AppButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
