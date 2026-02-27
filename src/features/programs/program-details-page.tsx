"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInfluencerProgram,
  updateInfluencerProgram,
  type InfluencerProgramRecord,
  type UpdateInfluencerProgramPayload,
} from "@/api/influencerPrograms";
import { ProgramForm } from "@/features/programs/program-form";
import { ProgramHeader } from "@/features/programs/program-header";
import { ProgramTabs, type ProgramTabId } from "@/features/programs/program-tabs";
import { AppButton, ErrorState, LoadingState, useAppToast } from "@/shared/ui";

type ProgramDetailsPageProps = {
  programId: string;
};

export function ProgramDetailsPage({ programId }: ProgramDetailsPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<ProgramTabId>("details");

  const detailsQuery = useQuery<InfluencerProgramRecord, Error>({
    queryKey: ["influencerProgram", programId],
    queryFn: async () => {
      const result = await getInfluencerProgram(programId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateInfluencerProgramPayload) => {
      const result = await updateInfluencerProgram(programId, payload);
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
        queryClient.invalidateQueries({ queryKey: ["influencerProgram", programId] }),
        queryClient.invalidateQueries({ queryKey: ["influencerPrograms"] }),
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
      <ProgramHeader program={program} onBack={() => router.push("/influencer/programs")} />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <ProgramTabs activeTab={activeTab} onChange={setActiveTab} />
          <AppButton
            type="button"
            variant="ghost"
            onClick={() => router.push("/influencer/programs")}
          >
            Back to Programs
          </AppButton>
        </div>

        {activeTab === "details" ? (
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
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-sidebar/40 p-6">
            <p className="text-sm font-medium text-foreground">Coming next: versions & publish</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Здесь появится управление версиями программы и публикацией.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
