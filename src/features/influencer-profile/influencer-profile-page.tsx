"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { uploadMedia } from "@/api/media";
import {
  createInfluencerProfile,
  getInfluencerProfile,
  updateInfluencerProfile,
  type InfluencerProfileRecord,
} from "@/api/influencerProfile";
import {
  AppButton,
  AppInput,
  ErrorState,
  LoadingState,
  PageHeader,
  useAppToast,
} from "@/shared/ui";
import { ru } from "@/localization/ru";

const socialLinkSchema = z.object({
  type: z.string().trim().min(1, ru.profile.linkTypeRequired),
  url: z.string().trim().url(ru.profile.linkUrlInvalid),
});

const profileFormSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  avatarMediaId: z.union([z.literal(""), z.string().uuid(ru.profile.avatarIdInvalid)]),
  socialLinks: z.array(socialLinkSchema),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AvatarPreview = {
  url: string;
  type?: "IMAGE" | "VIDEO";
};

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
  const [avatarPreview, setAvatarPreview] = useState<AvatarPreview | null>(null);

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

  useEffect(() => {
    if (!profileQuery.data?.avatarUrl) {
      setAvatarPreview(null);
      return;
    }

    setAvatarPreview({
      url: profileQuery.data.avatarUrl,
      type: profileQuery.data.avatarType,
    });
  }, [profileQuery.data?.avatarType, profileQuery.data?.avatarUrl]);

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
        title: ru.profile.saveSuccessTitle,
        description: ru.profile.saveSuccessDescription,
      });
      router.replace(resolveReturnPath(returnTo));
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.profile.saveErrorDescription;
      setSubmitError(message);
      pushToast({
        kind: "error",
        title: ru.profile.saveErrorTitle,
        description: message,
      });
    },
  });

  const avatarUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadMedia(file, { role: "INFLUENCER" });
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: (media) => {
      form.setValue("avatarMediaId", media.id, { shouldDirty: true });
      setAvatarPreview({
        url: media.url,
        type: media.type,
      });
      pushToast({
        kind: "success",
        title: ru.profile.uploadSuccessTitle,
        description: ru.profile.uploadSuccessDescription,
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : ru.profile.uploadErrorDescription;
      pushToast({
        kind: "error",
        title: ru.profile.uploadErrorTitle,
        description: message,
      });
    },
  });

  if (profileQuery.isLoading) {
    return <LoadingState title={ru.profile.loading} />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        title={ru.profile.loadError}
        description={profileQuery.error.message}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={onboardingMode ? ru.profile.titleCreate : ru.profile.titleEdit}
        subtitle={onboardingMode ? ru.profile.subtitleCreate : ru.profile.subtitleEdit}
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
          <label className="text-sm font-medium text-foreground">{ru.profile.displayName}</label>
          <AppInput
            {...form.register("displayName")}
            placeholder={ru.profile.displayNamePlaceholder}
            disabled={saveMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{ru.profile.bio}</label>
          <textarea
            {...form.register("bio")}
            placeholder={ru.profile.bioPlaceholder}
            disabled={saveMutation.isPending}
            className="min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{ru.profile.avatar}</label>
          <div className="rounded-md border border-border/80 bg-sidebar/40 p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              {ru.profile.uploadFromDevice}
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={saveMutation.isPending || avatarUploadMutation.isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                avatarUploadMutation.mutate(file);
                event.currentTarget.value = "";
              }}
              className="block w-full rounded-md border border-border bg-card p-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-secondary"
            />
            {avatarUploadMutation.isPending ? (
              <p className="mt-2 text-xs text-muted-foreground">{ru.profile.uploading}</p>
            ) : null}
            {avatarPreview ? (
              <div className="mt-3 w-44 overflow-hidden rounded-md border border-border bg-card">
                {avatarPreview.type === "VIDEO" ? (
                  <video
                    className="h-44 w-44 object-cover"
                    src={avatarPreview.url}
                    controls
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview.url}
                    alt={ru.profile.avatarPreviewAlt}
                    className="h-44 w-44 object-cover"
                  />
                )}
              </div>
            ) : null}
          </div>
          {avatarMediaId ? (
            <AppButton
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => {
                form.setValue("avatarMediaId", "", { shouldDirty: true });
                setAvatarPreview(null);
              }}
              disabled={saveMutation.isPending}
            >
              {ru.common.actions.clearAvatar}
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
            <p className="text-sm font-medium text-foreground">{ru.profile.socialLinks}</p>
            <AppButton
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              disabled={saveMutation.isPending}
              onClick={() => socialLinks.append({ type: "", url: "" })}
            >
              {ru.common.actions.addLink}
            </AppButton>
          </div>

          {socialLinks.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">{ru.profile.socialLinksEmpty}</p>
          ) : null}

          <div className="space-y-3">
            {socialLinks.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                <div>
                  <AppInput
                    {...form.register(`socialLinks.${index}.type`)}
                    placeholder={ru.profile.socialLinkTypePlaceholder}
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
                    placeholder={ru.profile.socialLinkUrlPlaceholder}
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
                  {ru.common.actions.delete}
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
            {ru.common.actions.cancel}
          </AppButton>
          <AppButton type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? ru.profile.saving : ru.common.actions.saveProfile}
          </AppButton>
        </div>
      </form>
    </div>
  );
}
