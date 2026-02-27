import { AppButton } from "@/shared/ui/app-button";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-card p-6 text-sm shadow-card">
      <p className="font-semibold text-card-foreground">{title}</p>
      {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
      {onRetry ? (
        <AppButton variant="secondary" className="mt-4" onClick={onRetry}>
          Повторить
        </AppButton>
      ) : null}
    </div>
  );
}
