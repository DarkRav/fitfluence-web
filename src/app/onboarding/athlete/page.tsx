"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAthleteProfile } from "@/api/athleteProfile";
import { normalizeApiError } from "@/api/httpClient";
import { useAuth } from "@/features/auth/use-auth";
import {
  AppButton,
  AppInput,
  AppTextarea,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

const athleteSchema = z.object({
  goalsInput: z.string().optional(),
  level: z.string().optional(),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
});

type AthleteFormValues = z.infer<typeof athleteSchema>;

function parseGoals(value?: string): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const goals = value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return goals.length > 0 ? goals : undefined;
}

function parseInteger(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.round(parsed);
}

function parseFloatNumber(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

export default function OnboardingAthletePage() {
  const router = useRouter();
  const auth = useAuth();
  const { pushToast } = useAppToast();

  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      goalsInput: "",
      level: "",
      heightCm: "",
      weightKg: "",
    },
  });

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me?.profiles.athleteProfileExists) {
      router.replace("/athlete");
    }
  }, [auth.me?.profiles.athleteProfileExists, auth.status, router]);

  const createMutation = useMutation({
    mutationFn: async (values: AthleteFormValues) => {
      const result = await createAthleteProfile({
        goals: parseGoals(values.goalsInput),
        level: values.level?.trim() || undefined,
        heightCm: parseInteger(values.heightCm),
        weightKg: parseFloatNumber(values.weightKg),
      });

      if (!result.ok && result.error.status !== 409) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Профиль атлета создан.",
      });
      await auth.refreshMe();
      router.replace("/me");
    },
  });

  const createError = createMutation.error ? normalizeApiError(createMutation.error) : null;

  useEffect(() => {
    if (createError?.kind === "unauthorized") {
      router.replace("/login");
    }
  }, [createError?.kind, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <LoadingState title="Проверяем доступ..." />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Создание профиля атлета"
          subtitle="Заполните данные профиля атлета для завершения onboarding."
        />

        {createError ? (
          <div className="mb-4">
            {createError.kind === "forbidden" ? (
              <ErrorState title="Недостаточно прав для создания профиля." />
            ) : (
              <ErrorState
                title="Не удалось создать профиль атлета."
                description={createError.message}
              />
            )}
          </div>
        ) : null}

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await createMutation.mutateAsync(values);
          })}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Цели</label>
            <AppTextarea
              {...form.register("goalsInput")}
              placeholder="Например: снижение веса, выносливость"
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Поле `goals` из OpenAPI. Можно перечислить через запятую или с новой строки.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Уровень подготовки</label>
            <AppInput
              {...form.register("level")}
              placeholder="Например: начальный"
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">Поле `level` из OpenAPI.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Рост (см)</label>
              <AppInput
                type="number"
                {...form.register("heightCm")}
                placeholder="Необязательно"
                disabled={createMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">Поле `heightCm` (integer).</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Вес (кг)</label>
              <AppInput
                type="number"
                step="0.1"
                {...form.register("weightKg")}
                placeholder="Необязательно"
                disabled={createMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">Поле `weightKg` (number).</p>
            </div>
          </div>

          <div className="flex justify-end">
            <AppButton type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Создаем..." : "Создать профиль"}
            </AppButton>
          </div>
        </form>
      </section>
    </main>
  );
}
