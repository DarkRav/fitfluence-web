import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-border bg-sidebar/70 text-muted-foreground",
        success: "border-secondary/40 bg-secondary/10 text-secondary",
        warning: "border-primary/35 bg-primary/15 text-foreground",
        destructive: "border-destructive/35 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
