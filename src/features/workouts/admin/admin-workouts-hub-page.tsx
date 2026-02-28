"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchAdminPrograms } from "@/api/adminPrograms";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
import { ru } from "@/localization/ru";
import {
  AppButton,
  AppInput,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

type ProgramStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

function isForbiddenMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("forbidden") || normalized.includes("недостаточно прав");
}

function renderStatus(status: ProgramStatus): string {
  if (status === "DRAFT") {
    return ru.common.status.DRAFT;
  }

  if (status === "PUBLISHED") {
    return ru.common.status.PUBLISHED;
  }

  return ru.common.status.ARCHIVED;
}

export function AdminWorkoutsHubPage() {
  const router = useRouter();
  const { pushToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const programsQuery = useQuery({
    queryKey: ["adminWorkoutsHub", page, REFERENCE_LIST_PAGE_SIZE, debouncedSearch],
    queryFn: async () => {
      const result = await searchAdminPrograms({
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

  useEffect(() => {
    if (!programsQuery.isError) {
      return;
    }

    pushToast({
      kind: "error",
      title: isForbiddenMessage(programsQuery.error.message)
        ? ru.common.states.notPermitted
        : ru.workouts.loadProgramsError,
      description: programsQuery.error.message,
    });
  }, [programsQuery.error, programsQuery.isError, pushToast]);

  const totalPages = programsQuery.data?.totalPages ?? 0;

  return (
    <div>
      <PageHeader
        title={ru.workouts.title}
        subtitle={ru.workouts.selectProgramDescription}
        actions={
          <div className="grid w-full gap-2">
            <AppInput
              className="w-full sm:w-[320px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={ru.common.placeholders.searchPrograms}
            />
            <div className="flex flex-wrap items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                onClick={() => router.push("/admin/programs")}
              >
                {ru.common.labels.allPrograms}
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
        <EmptyState
          title={ru.programs.page.emptyTitle}
          description={ru.programs.page.emptyDescription}
        />
      ) : null}

      {!programsQuery.isLoading && !programsQuery.isError && programsQuery.data ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sidebar/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.title}</th>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.status}</th>
                  <th className="px-4 py-3 font-medium">{ru.common.labels.publishedVersion}</th>
                  <th className="px-4 py-3 text-right font-medium">{ru.common.labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {programsQuery.data.items.map((program) => (
                  <tr
                    key={program.id}
                    className="border-t border-border/80 text-foreground transition-colors hover:bg-secondary/10"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{program.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {program.description ?? ru.common.states.dash}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {renderStatus(program.status)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {program.currentPublishedVersionNumber
                        ? `v${program.currentPublishedVersionNumber}`
                        : ru.common.states.dash}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {program.currentPublishedVersionId ? (
                          <AppButton
                            type="button"
                            variant="secondary"
                            className="h-9 px-3 text-xs"
                            onClick={() =>
                              router.push(
                                `/admin/programs/${program.id}/versions/${program.currentPublishedVersionId}/workouts`,
                              )
                            }
                          >
                            {ru.programs.versions.table.openWorkouts}
                          </AppButton>
                        ) : null}
                        <AppButton
                          type="button"
                          variant="secondary"
                          className="h-9 px-3 text-xs"
                          onClick={() => router.push(`/admin/programs/${program.id}`)}
                        >
                          {ru.common.labels.versions}
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </div>
      ) : null}
    </div>
  );
}
