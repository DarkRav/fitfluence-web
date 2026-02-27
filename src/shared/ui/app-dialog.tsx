"use client";

import * as React from "react";
import {
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogRoot,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/ui";

type AppDialogProps = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function AppDialog({ title, description, trigger, children }: AppDialogProps) {
  return (
    <AppDialogRoot>
      <AppDialogTrigger asChild>{trigger}</AppDialogTrigger>
      <AppDialogContent maxWidthClassName="max-w-lg">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-semibold text-card-foreground">
            {title}
          </AppDialogTitle>
          {description ? (
            <AppDialogDescription className="text-sm text-muted-foreground">
              {description}
            </AppDialogDescription>
          ) : null}
        </AppDialogHeader>
        <div className="mt-4">{children}</div>
      </AppDialogContent>
    </AppDialogRoot>
  );
}
