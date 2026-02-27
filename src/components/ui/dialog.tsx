"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogContentProps = Dialog.DialogContentProps & {
  maxWidthClassName?: string;
};

export function AppDialogContent({
  className,
  children,
  maxWidthClassName,
  ...props
}: DialogContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[96vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card focus:outline-none",
          maxWidthClassName ?? "max-w-2xl",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition hover:bg-card">
          <X className="h-4 w-4" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function AppDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function AppDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

export const AppDialogTitle = Dialog.Title;
export const AppDialogDescription = Dialog.Description;
export const AppDialogRoot = Dialog.Root;
export const AppDialogTrigger = Dialog.Trigger;
