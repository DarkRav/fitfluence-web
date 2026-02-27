import { Button, type ButtonProps } from "@/components/ui";

export type AppButtonProps = ButtonProps;

export function AppButton(props: AppButtonProps) {
  return <Button {...props} />;
}
