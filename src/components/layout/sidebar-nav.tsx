"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Dumbbell,
  ImageIcon,
  Repeat2,
  UserCircle2,
  Waves,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";
import { ru } from "@/localization/ru";

const adminItems = [
  { label: ru.sidebar.admin.programs, href: "/admin/programs", icon: ClipboardList },
  { label: ru.sidebar.admin.exercises, href: "/admin/exercises", icon: Dumbbell },
  { label: ru.sidebar.admin.muscles, href: "/admin/muscles", icon: Waves },
  { label: ru.sidebar.admin.equipment, href: "/admin/equipment", icon: Wrench },
  { label: ru.sidebar.admin.media, href: "/admin/media", icon: ImageIcon },
  { label: ru.sidebar.admin.progression, href: "/admin/progression", icon: Repeat2 },
];

const influencerItems = [
  { label: ru.sidebar.influencer.programs, href: "/influencer/programs", icon: ClipboardList },
  { label: ru.sidebar.influencer.exercises, href: "/influencer/exercises", icon: Dumbbell },
  { label: ru.sidebar.influencer.media, href: "/influencer/media", icon: ImageIcon },
  { label: ru.sidebar.influencer.profile, href: "/influencer/profile", icon: UserCircle2 },
];

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
