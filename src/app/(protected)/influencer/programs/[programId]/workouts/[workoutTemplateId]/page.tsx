import { InfluencerWorkoutDetailsRouteClientPage } from "./page-client";

export async function generateStaticParams() {
  return [{ programId: "__placeholder__", workoutTemplateId: "__placeholder__" }];
}

export default function InfluencerWorkoutDetailsRoutePage() {
  return <InfluencerWorkoutDetailsRouteClientPage />;
}
