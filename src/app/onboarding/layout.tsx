"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "anonymous") {
      router.replace("/login?returnTo=/onboarding");
    }
  }, [auth.status, router]);

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <LoadingState title="Проверяем авторизацию..." />
      </main>
    );
  }

  return <>{children}</>;
}
