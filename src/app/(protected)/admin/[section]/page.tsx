import { EmptyState, PageHeader } from "@/shared/ui";

type SectionPageProps = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({ params }: SectionPageProps) {
  const { section } = await params;

  return (
    <div>
      <PageHeader title={section.toUpperCase()} subtitle="Раздел-заглушка scaffold-а." />
      <EmptyState
        title="Контент пока не реализован"
        description="Каркас и авторизация уже готовы."
      />
    </div>
  );
}
