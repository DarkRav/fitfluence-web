import { AppButton, EmptyState, PageHeader } from "@/shared/ui";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader
        title="Fitfluence Web Admin"
        subtitle="Production scaffold is ready. Перейдите на /login для входа."
        actions={<AppButton>Перейти к входу</AppButton>}
      />
      <EmptyState
        title="Каркас готов"
        description="Следующий этап — shell, auth, guards и OpenAPI-интеграция."
      />
    </main>
  );
}
