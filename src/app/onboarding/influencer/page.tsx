"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createInfluencerProfile,
  isInfluencerProfileCreateSupported,
} from "@/api/influencerProfile";
import { normalizeApiError } from "@/api/httpClient";
import { getMe } from "@/api/me";
import { resolveAuthReturnTo, resolvePostLoginPath } from "@/features/auth/post-login-routing";
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

const influencerSchema = z
  .object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatarMediaId: z.union([z.literal(""), z.string().uuid("Укажите корректный UUID медиа")]),
    socialType: z.string().optional(),
    socialUrl: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const hasType = Boolean(value.socialType?.trim());
    const hasUrl = Boolean(value.socialUrl?.trim());

    if (hasType !== hasUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: hasType ? ["socialUrl"] : ["socialType"],
        message: "Для социальной ссылки заполните оба поля: тип и URL.",
      });
      return;
    }

    if (hasUrl && value.socialUrl) {
      const urlResult = z.string().url().safeParse(value.socialUrl.trim());
      if (!urlResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["socialUrl"],
          message: "Укажите корректный URL.",
        });
      }
    }
  });

type InfluencerFormValues = z.infer<typeof influencerSchema>;

export default function OnboardingInfluencerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { pushToast } = useAppToast();
  const createSupported = isInfluencerProfileCreateSupported();
  const returnTo = resolveAuthReturnTo(searchParams.get("returnTo"));
  const onboardingBackPath = returnTo
    ? `/onboarding?${new URLSearchParams({ returnTo }).toString()}`
    : "/onboarding";

  const form = useForm<InfluencerFormValues>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      avatarMediaId: "",
      socialType: "",
      socialUrl: "",
    },
  });

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && auth.me?.profiles.influencerProfileExists && auth.me) {
      router.replace(resolvePostLoginPath(auth.me, { returnTo }));
    }
  }, [auth.me, auth.me?.profiles.influencerProfileExists, auth.status, returnTo, router]);

  useEffect(() => {
    if (!createSupported) {
      // TODO(backend): expose POST /v1/influencer/profile in OpenAPI/runtime where missing.
      console.warn("TODO: создание профиля инфлюэнсера не поддержано сервером.");
    }
  }, [createSupported]);

  const createMutation = useMutation({
    mutationFn: async (values: InfluencerFormValues) => {
      const socialType = values.socialType?.trim();
      const socialUrl = values.socialUrl?.trim();
      const result = await createInfluencerProfile({
        displayName: values.displayName?.trim() || undefined,
        bio: values.bio?.trim() || undefined,
        avatarMediaId: values.avatarMediaId || undefined,
        socialLinks:
          socialType && socialUrl
            ? [
                {
                  type: socialType,
                  url: socialUrl,
                },
              ]
            : undefined,
      });

      if (!result.ok && result.error.status !== 409) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Профиль инфлюэнсера создан.",
      });
      await auth.refreshMe();
      const meResult = await getMe();
      if (meResult.ok) {
        router.replace(resolvePostLoginPath(meResult.data, { returnTo }));
        return;
      }

      router.replace("/influencer/programs");
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
          title="Создание профиля инфлюэнсера"
          subtitle="Укажите публичные данные профиля. Всё можно обновить позже."
        />

        {!createSupported ? (
          <ErrorState title="Создание профиля инфлюэнсера не поддержано сервером" />
        ) : (
          <>
            {createError ? (
              <div className="mb-4">
                {createError.kind === "forbidden" ? (
                  <ErrorState title="Недостаточно прав для создания профиля." />
                ) : (
                  <ErrorState
                    title="Не удалось создать профиль инфлюэнсера."
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
                <p className="text-sm font-medium text-foreground">Публичная информация</p>

                <div className="mt-3 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Отображаемое имя{" "}
                      <span className="text-muted-foreground">(необязательно)</span>
                    </label>
                    <AppInput
                      {...form.register("displayName")}
                      placeholder="Например: Анна Fit"
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      О себе <span className="text-muted-foreground">(необязательно)</span>
                    </label>
                    <AppTextarea
                      {...form.register("bio")}
                      placeholder="Кратко расскажите о себе"
                      disabled={createMutation.isPending}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-sidebar/35 p-4">
                <p className="text-sm font-medium text-foreground">Аватар</p>
                <div className="mt-3 space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    ID аватара (UUID) <span className="text-muted-foreground">(необязательно)</span>
                  </label>
                  <AppInput
                    {...form.register("avatarMediaId")}
                    placeholder="Например: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                    disabled={createMutation.isPending}
                  />
                  {form.formState.errors.avatarMediaId ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.avatarMediaId.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Если поле пустое, аватар можно добавить позже.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-sidebar/40 p-4">
                <p className="text-sm font-medium text-foreground">
                  Социальная ссылка (необязательно)
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <AppInput
                      {...form.register("socialType")}
                      placeholder="Тип (например, instagram)"
                      disabled={createMutation.isPending}
                    />
                    {form.formState.errors.socialType ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.socialType.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <AppInput
                      {...form.register("socialUrl")}
                      placeholder="https://..."
                      disabled={createMutation.isPending}
                    />
                    {form.formState.errors.socialUrl ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.socialUrl.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Заполните оба поля вместе: тип и URL.
                </p>
              </div>

              <div className="flex justify-between gap-2">
                <AppButton
                  type="button"
                  variant="secondary"
                  disabled={createMutation.isPending}
                  onClick={() => router.push(onboardingBackPath)}
                >
                  Назад
                </AppButton>
                <AppButton type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Создаем..." : "Создать профиль"}
                </AppButton>
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
