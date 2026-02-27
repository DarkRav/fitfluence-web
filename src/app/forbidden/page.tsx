import Link from "next/link";
import { AppButton, ErrorState, PageHeader } from "@/shared/ui";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <PageHeader
        title="Доступ запрещен"
        subtitle="Недостаточно прав для просмотра этой страницы."
      />
      <ErrorState title="403" description="У вашей учетной записи нет нужной роли." />
      <AppButton asChild variant="secondary" className="mt-4">
        <Link href="/login">Вернуться ко входу</Link>
      </AppButton>
    </main>
  );
}
