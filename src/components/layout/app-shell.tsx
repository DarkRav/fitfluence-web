import { AppLogo } from "@/components/layout/app-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-4 py-4 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 gap-4 lg:grid-cols-[270px_1fr]">
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
