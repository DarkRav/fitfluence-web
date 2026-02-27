import { EmptyState, PageHeader } from "@/shared/ui";

export default function AdminPage() {
  return (
    <div>
      <PageHeader title="Панель администратора" subtitle="Стартовая точка для роли ADMIN." />
      <EmptyState title="Раздел в разработке" description="CRUD экраны добавим отдельным этапом." />
    </div>
  );
}
