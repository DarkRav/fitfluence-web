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
  heightCm: z
    .string()
    .optional()
    .refine((value) => !value?.trim() || Number(value) > 0, "Рост должен быть больше 0"),
  weightKg: z
    .string()
    .optional()
    .refine(
      (value) => !value?.trim() || Number(value.replace(",", ".")) > 0,
      "Вес должен быть больше 0",
    ),
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
          subtitle="Укажите базовые параметры. Все поля можно заполнить позже."
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
          <div className="rounded-xl border border-border bg-sidebar/35 p-4">
            <p className="text-sm font-medium text-foreground">Цели и уровень</p>

            <div className="mt-3 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Цели <span className="text-muted-foreground">(необязательно)</span>
                </label>
                <AppTextarea
                  {...form.register("goalsInput")}
                  placeholder="Например: снижение веса, выносливость"
                  disabled={createMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Можно перечислить через запятую или с новой строки.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Уровень подготовки <span className="text-muted-foreground">(необязательно)</span>
                </label>
                <AppInput
                  {...form.register("level")}
                  placeholder="Например: начальный"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-sidebar/35 p-4">
            <p className="text-sm font-medium text-foreground">Физические параметры</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Рост (см) <span className="text-muted-foreground">(необязательно)</span>
                </label>
                <AppInput
                  type="number"
                  {...form.register("heightCm")}
                  placeholder="Например: 180"
                  disabled={createMutation.isPending}
                />
                {form.formState.errors.heightCm ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.heightCm.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Вес (кг) <span className="text-muted-foreground">(необязательно)</span>
                </label>
                <AppInput
                  type="number"
                  step="0.1"
                  {...form.register("weightKg")}
                  placeholder="Например: 74.5"
                  disabled={createMutation.isPending}
                />
                {form.formState.errors.weightKg ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.weightKg.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <AppButton
              type="button"
              variant="secondary"
              disabled={createMutation.isPending}
              onClick={() => router.push("/onboarding")}
            >
              Назад
            </AppButton>
            <AppButton type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Создаем..." : "Создать профиль"}
            </AppButton>
          </div>
        </form>
      </section>
    </main>
  );
}
