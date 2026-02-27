import { EmptyState, PageHeader } from "@/shared/ui";

export default function InfluencerPage() {
  return (
    <div>
      <PageHeader title="Influencer Space" subtitle="Стартовая точка для role INFLUENCER." />
      <EmptyState title="Раздел в разработке" description="Будущие инструменты инфлюенсера." />
    </div>
  );
}
