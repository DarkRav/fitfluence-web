"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

function resolveRequiredRole(pathname: string): "ADMIN" | "INFLUENCER" | null {
  if (pathname.startsWith("/admin")) {
    return "ADMIN";
  }

  if (pathname.startsWith("/influencer")) {
    return "INFLUENCER";
  }

  return null;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const requiredRole = resolveRequiredRole(pathname);

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login");
      return;
    }

    if (auth.status === "authenticated" && requiredRole && !auth.hasRole(requiredRole)) {
      router.replace("/forbidden");
    }
  }, [auth, requiredRole, router]);

  if (auth.status !== "authenticated") {
    return <LoadingState title="Проверяем доступ..." />;
  }

  if (requiredRole && !auth.hasRole(requiredRole)) {
    return <LoadingState title="Перенаправляем на страницу 403..." />;
  }

  return <>{children}</>;
}
