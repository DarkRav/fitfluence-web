import * as React from "react";
import { Input } from "@/components/ui";

export const AppInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <Input ref={ref} {...props} />;
});

AppInput.displayName = "AppInput";
