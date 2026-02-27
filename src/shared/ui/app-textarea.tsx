import * as React from "react";
import { Textarea } from "@/components/ui";

export const AppTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  return <Textarea ref={ref} {...props} />;
});

AppTextarea.displayName = "AppTextarea";
