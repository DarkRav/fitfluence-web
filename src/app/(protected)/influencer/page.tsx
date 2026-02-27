import { EmptyState, PageHeader } from "@/shared/ui";

export default function InfluencerPage() {
  return (
    <div>
      <PageHeader title="Кабинет инфлюенсера" subtitle="Стартовая точка для роли INFLUENCER." />
      <EmptyState title="Раздел в разработке" description="Будущие инструменты инфлюенсера." />
    </div>
  );
}
