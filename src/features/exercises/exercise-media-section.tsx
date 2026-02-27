"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MediaPickerDialog } from "@/features/media/media-picker-dialog";
import { AppButton } from "@/shared/ui";
import type { ExerciseCrudScope } from "@/features/exercises/types";
import type { MediaRole } from "@/api/media";

const roleByScope: Record<ExerciseCrudScope, MediaRole> = {
  admin: "ADMIN",
  influencer: "INFLUENCER",
};

type ExerciseMediaSectionProps = {
  scope: ExerciseCrudScope;
  mediaIds: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function ExerciseMediaSection({
  scope,
  mediaIds,
  onChange,
  disabled,
}: ExerciseMediaSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-foreground">Медиа</label>
        <AppButton
          type="button"
          variant="secondary"
          className="h-9 px-3 text-xs"
          onClick={() => setPickerOpen(true)}
          disabled={disabled}
        >
          Добавить медиа
        </AppButton>
      </div>

      <div className="flex min-h-11 flex-wrap gap-2 rounded-md border border-border/80 bg-sidebar/40 p-2">
        {mediaIds.map((mediaId) => (
          <span
            key={mediaId}
            className="inline-flex items-center gap-1 rounded-md border border-secondary/35 bg-secondary/10 px-2 py-1 text-xs text-foreground"
          >
            <span className="font-mono">{mediaId}</span>
            <button
              type="button"
              className="rounded p-0.5 text-muted-foreground transition hover:bg-secondary/20 hover:text-foreground"
              onClick={() => onChange(mediaIds.filter((value) => value !== mediaId))}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {mediaIds.length === 0 ? <p className="text-sm text-muted-foreground">Не выбрано</p> : null}
      </div>

      <MediaPickerDialog
        role={roleByScope[scope]}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(id) => {
          if (mediaIds.includes(id)) {
            return;
          }

          onChange([...mediaIds, id]);
        }}
      />
    </div>
  );
}
