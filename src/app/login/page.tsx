import { AppButton, PageHeader } from "@/shared/ui";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-card">
        <PageHeader
          title="Вход"
          subtitle="Авторизация через Keycloak будет подключена на следующем этапе."
        />
        <AppButton className="w-full">Sign in</AppButton>
      </section>
    </main>
  );
}
