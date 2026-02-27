"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  createInfluencerProfile,
  getInfluencerProfile,
  updateInfluencerProfile,
  type InfluencerProfileRecord,
} from "@/api/influencerProfile";
import { MediaPicker } from "@/features/media";
import {
  AppButton,
  AppInput,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";

const socialLinkSchema = z.object({
  type: z.string().trim().min(1, "Укажите тип ссылки"),
  url: z.string().trim().url("Введите корректный URL"),
});

const profileFormSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  avatarMediaId: z.union([z.literal(""), z.string().uuid("Некорректный ID медиа")]),
  socialLinks: z.array(socialLinkSchema),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function buildDefaultValues(profile: InfluencerProfileRecord | null): ProfileFormValues {
  return {
    displayName: profile?.displayName ?? "",
    bio: profile?.bio ?? "",
    avatarMediaId: profile?.avatarMediaId ?? "",
    socialLinks: profile?.socialLinks ?? [],
  };
}

function resolveReturnPath(returnTo: string | null, defaultPath = "/influencer"): string {
  if (!returnTo) {
    return defaultPath;
  }

  if (returnTo.startsWith("/influencer") && !returnTo.startsWith("/influencer/profile")) {
    return returnTo;
  }

  return defaultPath;
}

export function InfluencerProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingMode = searchParams.get("onboarding") === "1";
  const returnTo = searchParams.get("returnTo");
  const { pushToast } = useAppToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const profileQuery = useQuery<InfluencerProfileRecord | null, Error>({
    queryKey: ["influencerProfile"],
    queryFn: async () => {
      const result = await getInfluencerProfile();
      if (!result.ok) {
        if (result.error.kind === "not_found") {
          return null;
        }

        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const defaultValues = useMemo(
    () => buildDefaultValues(profileQuery.data ?? null),
    [profileQuery.data],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const socialLinks = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });
  const avatarMediaId = useWatch({
    control: form.control,
    name: "avatarMediaId",
  });

  const saveMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const payload = {
        displayName: values.displayName.trim() || undefined,
        bio: values.bio.trim() || undefined,
        avatarMediaId: values.avatarMediaId || undefined,
        socialLinks: values.socialLinks,
      };

      const result =
        profileQuery.data === null
          ? await createInfluencerProfile(payload)
          : await updateInfluencerProfile(payload);

      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: () => {
      pushToast({
        kind: "success",
        title: "Профиль сохранен",
        description: "Данные профиля инфлюэнсера обновлены.",
      });
      router.replace(resolveReturnPath(returnTo));
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Не удалось сохранить профиль";
      setSubmitError(message);
      pushToast({
        kind: "error",
        title: "Ошибка сохранения",
        description: message,
      });
    },
  });

  if (profileQuery.isLoading) {
    return <LoadingState title="Загружаем профиль инфлюэнсера..." />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        title="Не удалось загрузить профиль"
        description={profileQuery.error.message}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={onboardingMode ? "Create your influencer profile" : "Edit profile"}
        subtitle={
          onboardingMode
            ? "Заполните профиль, чтобы продолжить работу в кабинете инфлюэнсера."
            : "Обновите данные профиля инфлюэнсера."
        }
      />

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitError(null);
          await saveMutation.mutateAsync(values);
        })}
      >
        {submitError ? (
          <div className="rounded-md border border-destructive/35 bg-destructive/10 p-3 text-sm text-foreground">
            {submitError}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Display name</label>
          <AppInput
            {...form.register("displayName")}
            placeholder="Ваше отображаемое имя"
            disabled={saveMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            {...form.register("bio")}
            placeholder="Коротко о себе"
            disabled={saveMutation.isPending}
            className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Avatar</label>
          <MediaPicker
            value={avatarMediaId || undefined}
            onChange={(id) => {
              form.setValue("avatarMediaId", id, { shouldDirty: true });
            }}
          />
          {avatarMediaId ? (
            <AppButton
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => form.setValue("avatarMediaId", "", { shouldDirty: true })}
              disabled={saveMutation.isPending}
            >
              Очистить аватар
            </AppButton>
          ) : null}
          {form.formState.errors.avatarMediaId ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.avatarMediaId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-3 rounded-lg border border-border/80 bg-sidebar/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Social links</p>
            <AppButton
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              disabled={saveMutation.isPending}
              onClick={() => socialLinks.append({ type: "", url: "" })}
            >
              Добавить ссылку
            </AppButton>
          </div>

          {socialLinks.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ссылки не добавлены.</p>
          ) : null}

          <div className="space-y-3">
            {socialLinks.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                <div>
                  <AppInput
                    {...form.register(`socialLinks.${index}.type`)}
                    placeholder="Type (instagram, youtube)"
                    disabled={saveMutation.isPending}
                  />
                  {form.formState.errors.socialLinks?.[index]?.type ? (
                    <p className="mt-1 text-xs text-destructive">
                      {form.formState.errors.socialLinks[index]?.type?.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <AppInput
                    {...form.register(`socialLinks.${index}.url`)}
                    placeholder="https://example.com/profile"
                    disabled={saveMutation.isPending}
                  />
                  {form.formState.errors.socialLinks?.[index]?.url ? (
                    <p className="mt-1 text-xs text-destructive">
                      {form.formState.errors.socialLinks[index]?.url?.message}
                    </p>
                  ) : null}
                </div>
                <AppButton
                  type="button"
                  variant="destructive"
                  className="h-11 px-3"
                  onClick={() => socialLinks.remove(index)}
                  disabled={saveMutation.isPending}
                >
                  Удалить
                </AppButton>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <AppButton
            type="button"
            variant="secondary"
            disabled={saveMutation.isPending}
            onClick={() => router.replace(resolveReturnPath(returnTo))}
          >
            Отмена
          </AppButton>
          <AppButton type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Сохраняем..." : "Сохранить профиль"}
          </AppButton>
        </div>
      </form>
    </div>
  );
}
