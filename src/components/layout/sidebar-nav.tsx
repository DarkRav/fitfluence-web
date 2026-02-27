"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Dumbbell, ImageIcon, Repeat2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Exercises", href: "/admin/exercises", icon: Dumbbell },
  { label: "Programs", href: "/admin/programs", icon: ClipboardList },
  { label: "Workouts", href: "/admin/workouts", icon: ShieldCheck },
  { label: "Progression", href: "/admin/progression", icon: Repeat2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
              isActive
                ? "border border-secondary/30 bg-secondary/15 text-secondary shadow-glow"
                : "text-sidebar-foreground/80 hover:bg-card hover:text-sidebar-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
