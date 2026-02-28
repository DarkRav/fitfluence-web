"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAthleteProfile } from "@/api/athleteProfile";
import { createInfluencerProfile } from "@/api/influencerProfile";
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

type OnboardingStep = "INFLUENCER" | "ATHLETE";

function resolveLandingPath(roles: string[]): string {
  if (roles.includes("ADMIN")) {
    return "/admin/programs";
  }

  if (roles.includes("INFLUENCER")) {
    return "/influencer/programs";
  }

  if (roles.includes("ATHLETE")) {
    return "/athlete";
  }

  return "/welcome";
}

function resolvePendingSteps(
  requiresInfluencerProfile: boolean,
  requiresAthleteProfile: boolean,
): OnboardingStep[] {
  const steps: OnboardingStep[] = [];
  if (requiresInfluencerProfile) {
    steps.push("INFLUENCER");
  }
  if (requiresAthleteProfile) {
    steps.push("ATHLETE");
  }
  return steps;
}

function parseGoals(value: string): string[] | undefined {
  const goals = value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return goals.length > 0 ? goals : undefined;
}

function parseInteger(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.round(parsed);
}

function parseFloatNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return parsed;
}

export function OnboardingPage() {
  const router = useRouter();
  const auth = useAuth();
  const { pushToast } = useAppToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarMediaId, setAvatarMediaId] = useState("");
  const [socialType, setSocialType] = useState("");
  const [socialUrl, setSocialUrl] = useState("");

  const [goalsInput, setGoalsInput] = useState("");
  const [level, setLevel] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const steps = useMemo(
    () =>
      resolvePendingSteps(
        Boolean(auth.me?.onboarding.requiresInfluencerProfile),
        Boolean(auth.me?.onboarding.requiresAthleteProfile),
      ),
    [auth.me?.onboarding.requiresAthleteProfile, auth.me?.onboarding.requiresInfluencerProfile],
  );

  const currentStep = steps[stepIndex] ?? null;

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status !== "authenticated") {
      return;
    }

    if (steps.length === 0) {
      if (auth.me?.profiles.athleteProfileExists) {
        router.replace("/athlete");
        return;
      }

      router.replace(resolveLandingPath(auth.roles));
      return;
    }

    if (stepIndex >= steps.length) {
      setStepIndex(steps.length - 1);
    }
  }, [auth.me?.profiles.athleteProfileExists, auth.roles, auth.status, router, stepIndex, steps]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
        <LoadingState title="Проверяем состояние onboarding..." />
      </main>
    );
  }

  const submitInfluencer = async () => {
    const normalizedType = socialType.trim();
    const normalizedUrl = socialUrl.trim();

    const result = await createInfluencerProfile({
      displayName: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
      avatarMediaId: avatarMediaId.trim() || undefined,
      socialLinks:
        normalizedType && normalizedUrl
          ? [
              {
                type: normalizedType,
                url: normalizedUrl,
              },
            ]
          : undefined,
    });

    if (!result.ok && result.error.status !== 409) {
      throw new Error(result.error.message);
    }
  };

  const submitAthlete = async () => {
    const result = await createAthleteProfile({
      goals: parseGoals(goalsInput),
      level: level.trim() || undefined,
      heightCm: parseInteger(heightCm),
      weightKg: parseFloatNumber(weightKg),
    });

    if (!result.ok && result.error.status !== 409) {
      throw new Error(result.error.message);
    }
  };

  const onSubmitStep = async () => {
    if (!currentStep) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (currentStep === "INFLUENCER") {
        await submitInfluencer();
      } else {
        await submitAthlete();
      }

      await auth.refreshMe();
      pushToast({
        kind: "success",
        title: "Профиль сохранен",
        description: "Данные профиля успешно применены.",
      });
    } catch (error) {
      const normalized = normalizeApiError(error);
      setSubmitError(normalized.message);
      pushToast({
        kind: "error",
        title: "Не удалось создать профиль",
        description: normalized.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Завершение регистрации"
          subtitle={
            steps.length > 1
              ? `Шаг ${stepIndex + 1} из ${steps.length}`
              : "Нужно заполнить профиль перед началом работы."
          }
        />

        {submitError ? (
          <div className="mb-4">
            <ErrorState title="Ошибка сохранения профиля" description={submitError} />
          </div>
        ) : null}

        {currentStep === "INFLUENCER" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Создание профиля инфлюэнсера
              </h2>
              <p className="text-sm text-muted-foreground">
                Заполните данные профиля. Поля можно дополнить позже.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Отображаемое имя</label>
              <AppInput
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Например: Анна Fit"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">О себе</label>
              <AppTextarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Коротко расскажите о своей экспертизе"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">ID аватара (UUID)</label>
              <AppInput
                value={avatarMediaId}
                onChange={(event) => setAvatarMediaId(event.target.value)}
                placeholder="Необязательно"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Поле соответствует `avatarMediaId` в API и может быть пустым.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-sidebar/40 p-4">
              <p className="text-sm font-medium text-foreground">
                Социальная ссылка (необязательно)
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <AppInput
                  value={socialType}
                  onChange={(event) => setSocialType(event.target.value)}
                  placeholder="Тип: instagram, youtube"
                  disabled={isSubmitting}
                />
                <AppInput
                  value={socialUrl}
                  onChange={(event) => setSocialUrl(event.target.value)}
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        ) : currentStep === "ATHLETE" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Создание профиля атлета</h2>
              <p className="text-sm text-muted-foreground">
                Укажите базовые параметры. Эти поля соответствуют OpenAPI-контракту.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Цели</label>
              <AppTextarea
                value={goalsInput}
                onChange={(event) => setGoalsInput(event.target.value)}
                placeholder="Например: снижение веса, набор силы"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Можно перечислить через запятую или с новой строки.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Уровень подготовки</label>
              <AppInput
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                placeholder="Например: начальный"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Рост (см)</label>
                <AppInput
                  type="number"
                  value={heightCm}
                  onChange={(event) => setHeightCm(event.target.value)}
                  placeholder="Необязательно"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Вес (кг)</label>
                <AppInput
                  type="number"
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                  placeholder="Необязательно"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        ) : (
          <LoadingState title="Определяем шаг onboarding..." />
        )}

        <div className="mt-6 flex justify-end">
          <AppButton type="button" disabled={isSubmitting || !currentStep} onClick={onSubmitStep}>
            {isSubmitting ? "Сохраняем..." : "Создать профиль"}
          </AppButton>
        </div>
      </section>
    </main>
  );
}
