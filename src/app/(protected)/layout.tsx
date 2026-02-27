import { AppShell } from "@/components/layout/app-shell";
import { RouteGuard } from "@/features/auth/route-guard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
