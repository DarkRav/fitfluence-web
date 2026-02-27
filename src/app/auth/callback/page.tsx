import { LoadingState, PageHeader } from "@/shared/ui";

export default function AuthCallbackPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <PageHeader title="Auth callback" subtitle="Обработка ответа OIDC." />
      <LoadingState title="Завершаем вход..." />
    </main>
  );
}
