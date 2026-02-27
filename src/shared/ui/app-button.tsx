import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-gradient text-primary-foreground shadow-card hover:brightness-105 active:brightness-95",
        secondary:
          "border border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary-hover",
        ghost: "text-foreground hover:bg-card hover:text-foreground",
        destructive:
          "bg-destructive/90 text-foreground hover:bg-destructive focus-visible:ring-destructive/40",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  },
);

AppButton.displayName = "AppButton";
