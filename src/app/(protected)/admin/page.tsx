import { EmptyState, PageHeader } from "@/shared/ui";

export default function AdminPage() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Стартовая точка для role ADMIN." />
      <EmptyState title="Раздел в разработке" description="CRUD экраны добавим отдельным этапом." />
    </div>
  );
}
