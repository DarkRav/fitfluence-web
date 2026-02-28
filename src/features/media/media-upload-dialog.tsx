"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia, type MediaRole } from "@/api/media";
import { AppButton, AppInput, useAppToast } from "@/shared/ui";

type MediaUploadDialogProps = {
  role: MediaRole;
  triggerLabel?: string;
  triggerVariant?: "primary" | "secondary" | "ghost";
  onUploaded?: (mediaId: string) => void;
};

export function MediaUploadDialog({
  role,
  triggerLabel = "Загрузить",
  triggerVariant = "primary",
  onUploaded,
}: MediaUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();

  const uploadMutation = useMutation({
    mutationFn: async (payload: { file: File; tags: string[] }) => {
      const result = await uploadMedia(payload.file, {
        role,
        tags: payload.tags,
        onProgress: (value) => setProgress(value),
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async (uploadedMedia) => {
      pushToast({
        kind: "success",
        title: "Файл загружен",
        description: "Медиа успешно добавлено.",
      });
      if (uploadedMedia?.id) {
        onUploaded?.(uploadedMedia.id);
      }
      setFile(null);
      setTagInput("");
      setTags([]);
      setProgress(0);
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error) => {
      pushToast({
        kind: "error",
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить файл",
      });
    },
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!uploadMutation.isPending) {
          setOpen(nextOpen);
          if (!nextOpen) {
            setFile(null);
            setTagInput("");
            setTags([]);
            setProgress(0);
          }
        }
      }}
    >
      <Dialog.Trigger asChild>
        <AppButton variant={triggerVariant}>
          <Upload className="mr-2 h-4 w-4" />
          {triggerLabel}
        </AppButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Загрузка медиа
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Поддерживаются изображения и видео.
          </Dialog.Description>

          <div className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
              }}
              disabled={uploadMutation.isPending}
              className="block w-full rounded-md border border-border bg-card p-3 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-secondary"
            />

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Теги</p>
              <div className="flex gap-2">
                <AppInput
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") {
                      return;
                    }
                    event.preventDefault();
                    const normalized = tagInput.trim();
                    if (!normalized || tags.includes(normalized)) {
                      return;
                    }
                    setTags((previous) => [...previous, normalized]);
                    setTagInput("");
                  }}
                  disabled={uploadMutation.isPending}
                  placeholder="Введите тег"
                />
                <AppButton
                  type="button"
                  variant="secondary"
                  disabled={uploadMutation.isPending || tagInput.trim().length === 0}
                  onClick={() => {
                    const normalized = tagInput.trim();
                    if (!normalized || tags.includes(normalized)) {
                      return;
                    }
                    setTags((previous) => [...previous, normalized]);
                    setTagInput("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </AppButton>
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/10 px-2 py-1 text-xs text-foreground"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setTags((previous) => previous.filter((value) => value !== tag))
                        }
                        disabled={uploadMutation.isPending}
                        className="rounded-sm p-0.5 text-muted-foreground transition hover:bg-card hover:text-foreground"
                        aria-label={`Удалить тег ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {uploadMutation.isPending ? (
              <div>
                <p className="text-xs text-muted-foreground">Загрузка: {progress}%</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-sidebar">
                  <div
                    className="h-full bg-primary-gradient transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <AppButton
              className="w-full"
              disabled={!file || uploadMutation.isPending}
              onClick={() => {
                if (file) {
                  setProgress(0);
                  uploadMutation.mutate({ file, tags });
                }
              }}
            >
              {uploadMutation.isPending ? "Загружаем..." : "Загрузить файл"}
            </AppButton>
          </div>

          <Dialog.Close
            disabled={uploadMutation.isPending}
            className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition hover:bg-card disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
