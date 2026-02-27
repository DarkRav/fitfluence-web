"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMediaById, searchInfluencerMedia, type MediaRecord, type MediaRole } from "@/api/media";
import { useAuth } from "@/features/auth/use-auth";
import { AppButton, LoadingState } from "@/shared/ui";
import { MediaPickerDialog } from "@/features/media/media-picker-dialog";

type MediaPickerProps = {
  value?: string;
  onChange: (id: string) => void;
};

function resolveRole(roles: string[]): MediaRole {
  return roles.includes("ADMIN") ? "ADMIN" : "INFLUENCER";
}

function MediaPreview({ media }: { media: MediaRecord }) {
  if (media.type === "VIDEO") {
    return (
      <video
        className="h-20 w-28 rounded-md border border-border/80 object-cover"
        src={media.url}
        muted
        preload="metadata"
      />
    );
  }

  return (
    <img
      className="h-20 w-28 rounded-md border border-border/80 object-cover"
      src={media.url}
      alt={`Выбранное медиа ${media.id}`}
      loading="lazy"
    />
  );
}

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const role = resolveRole(auth.roles);

  const selectedMediaQuery = useQuery<MediaRecord | null, Error>({
    queryKey: ["media", "picker-selected", role, value],
    enabled: !!value,
    queryFn: async () => {
      if (!value) {
        return null;
      }

      if (role === "ADMIN") {
        const result = await getMediaById(value, "ADMIN");
        if (!result.ok) {
          throw new Error(result.error.message);
        }

        return result.data;
      }

      const listResult = await searchInfluencerMedia({ search: value, page: 0, size: 20 });
      if (!listResult.ok) {
        throw new Error(listResult.error.message);
      }

      return listResult.data.items.find((item) => item.id === value) ?? null;
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <AppButton type="button" variant="secondary" onClick={() => setOpen(true)}>
          Выбрать медиа
        </AppButton>
        {value ? <span className="font-mono text-xs text-muted-foreground">{value}</span> : null}
      </div>

      {selectedMediaQuery.isLoading ? <LoadingState title="Загружаем превью медиа..." /> : null}
      {selectedMediaQuery.data ? (
        <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card">
          <MediaPreview media={selectedMediaQuery.data} />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">{selectedMediaQuery.data.type}</p>
            <p className="max-w-[340px] break-all text-xs text-muted-foreground">
              {selectedMediaQuery.data.url}
            </p>
          </div>
        </div>
      ) : null}

      <MediaPickerDialog
        role={role}
        open={open}
        onOpenChange={setOpen}
        onSelect={(id) => {
          onChange(id);
        }}
      />
    </div>
  );
}
