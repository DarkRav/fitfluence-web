import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45",
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
      size: {
        md: "h-11 px-4 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = "Button";
