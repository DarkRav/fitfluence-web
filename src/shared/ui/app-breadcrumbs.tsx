import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AppBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function AppBreadcrumbs({ items }: AppBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link className="text-muted-foreground hover:text-secondary" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
