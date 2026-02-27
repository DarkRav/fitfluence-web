import { EmptyState, PageHeader } from "@/shared/ui";

export default function InfluencerProgressionPage() {
  return (
    <div>
      <PageHeader title="Progression" subtitle="Секция настройки прогрессии по неделям и блокам." />
      <EmptyState
        title="Раздел в разработке"
        description="Здесь появится управление прогрессией программ."
      />
    </div>
  );
}
