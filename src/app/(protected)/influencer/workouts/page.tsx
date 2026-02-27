import { EmptyState, PageHeader } from "@/shared/ui";

export default function InfluencerWorkoutsPage() {
  return (
    <div>
      <PageHeader
        title="Workouts"
        subtitle="Секция подготовки структуры тренировок для программ."
      />
      <EmptyState
        title="Раздел в разработке"
        description="Здесь появится конструктор тренировок."
      />
    </div>
  );
}
