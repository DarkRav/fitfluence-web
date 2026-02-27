export function LoadingState({ title = "Загрузка данных..." }: { title?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">
      {title}
    </div>
  );
}
