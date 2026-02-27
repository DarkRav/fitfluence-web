"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia, type MediaRole } from "@/api/media";
import { AppButton, useAppToast } from "@/shared/ui";

type MediaUploadDialogProps = {
  role: MediaRole;
};

export function MediaUploadDialog({ role }: MediaUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const { pushToast } = useAppToast();

  const uploadMutation = useMutation({
    mutationFn: async (candidate: File) => {
      const result = await uploadMedia(candidate, {
        role,
        onProgress: (value) => setProgress(value),
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      pushToast({
        kind: "success",
        title: "Файл загружен",
        description: "Медиа успешно добавлено.",
      });
      setFile(null);
      setProgress(0);
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["media", role] });
    },
    onError: (error) => {
      pushToast({
        kind: "error",
        title: "Upload failed",
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
            setProgress(0);
          }
        }
      }}
    >
      <Dialog.Trigger asChild>
        <AppButton className="shadow-glow">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </AppButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-card focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Upload media
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

            {uploadMutation.isPending ? (
              <div>
                <p className="text-xs text-muted-foreground">Uploading: {progress}%</p>
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
                  uploadMutation.mutate(file);
                }
              }}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload file"}
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
