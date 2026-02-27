import { AppLogo } from "@/components/layout/app-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-3 py-3 sm:px-4 sm:py-4 md:px-6">
      <div className="grid min-h-[calc(100vh-1.5rem)] grid-cols-1 gap-3 sm:min-h-[calc(100vh-2rem)] sm:gap-4 lg:grid-cols-[270px_1fr]">
        <aside className="rounded-lg border border-border bg-sidebar p-4 shadow-card">
          <AppLogo />
          <div className="mt-8">
            <SidebarNav />
          </div>
        </aside>
        <div className="space-y-4">
          <Topbar />
          <main className="rounded-lg border border-border bg-card p-6 shadow-card">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
