"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchAdminPrograms } from "@/api/adminPrograms";
import { REFERENCE_LIST_PAGE_SIZE, REFERENCE_LIST_STALE_TIME_MS } from "@/config/query";
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
    return "Draft";
  }

  if (status === "PUBLISHED") {
    return "Published";
  }

  return "Archived";
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
        ? "Not permitted"
        : "Не удалось загрузить программы",
      description: programsQuery.error.message,
    });
  }, [programsQuery.error, programsQuery.isError, pushToast]);

  const totalPages = programsQuery.data?.totalPages ?? 0;

  return (
    <div>
      <PageHeader
        title="Workouts"
        subtitle="Выберите программу и откройте её версии для редактирования workouts."
        actions={
          <div className="flex w-full max-w-4xl items-center gap-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search programs"
            />
            <AppButton
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/programs")}
            >
              All Programs
            </AppButton>
          </div>
        }
      />

      {programsQuery.isLoading ? <LoadingState title="Загружаем программы..." /> : null}

      {!programsQuery.isLoading && programsQuery.isError ? (
        <ErrorState
          title="Не удалось загрузить программы"
          description={programsQuery.error.message}
          onRetry={() => void programsQuery.refetch()}
        />
      ) : null}

      {!programsQuery.isLoading &&
      !programsQuery.isError &&
      (programsQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Программы не найдены"
          description="Откройте /admin/programs и создайте или найдите нужную программу."
        />
      ) : null}

      {!programsQuery.isLoading && !programsQuery.isError && programsQuery.data ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sidebar/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Published Version</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
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
                      <p className="text-xs text-muted-foreground">{program.description ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {renderStatus(program.status)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {program.currentPublishedVersionNumber
                        ? `v${program.currentPublishedVersionNumber}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AppButton
                          type="button"
                          variant="secondary"
                          className="h-9 px-3 text-xs"
                          onClick={() => router.push(`/admin/programs/${program.id}`)}
                        >
                          Open Versions
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
              Страница {programsQuery.data.page + 1} / {Math.max(totalPages, 1)} •{" "}
              {programsQuery.data.totalElements} элементов
            </p>
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Назад
              </AppButton>
              <AppButton
                type="button"
                variant="secondary"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
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
