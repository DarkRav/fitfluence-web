"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Dumbbell,
  ImageIcon,
  Repeat2,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";

const adminItems = [
  { label: "Дашборд", href: "/admin", icon: BarChart3 },
  { label: "Медиа", href: "/admin/media", icon: ImageIcon },
  { label: "Muscles", href: "/admin/muscles", icon: Target },
  { label: "Equipment", href: "/admin/equipment", icon: Wrench },
  { label: "Упражнения", href: "/admin/exercises", icon: Dumbbell },
  { label: "Программы", href: "/admin/programs", icon: ClipboardList },
  { label: "Тренировки", href: "/admin/workouts", icon: ShieldCheck },
  { label: "Прогрессия", href: "/admin/progression", icon: Repeat2 },
];

const influencerItems = [{ label: "Медиа", href: "/influencer/media", icon: ImageIcon }];

export function SidebarNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const items = auth.hasRole("ADMIN") ? adminItems : influencerItems;

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
