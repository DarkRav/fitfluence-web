"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === "authenticated") {
      if (auth.hasRole("ADMIN")) {
        router.replace("/admin");
        return;
      }
      if (auth.hasRole("INFLUENCER")) {
        router.replace("/influencer");
        return;
      }
      router.replace("/forbidden");
    }
  }, [auth, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await auth.signIn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-card">
        <PageHeader title="Вход" subtitle="Авторизация через корпоративный Keycloak." />
        <AppButton className="w-full" onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Перенаправляем..." : "Sign in"}
        </AppButton>
      </section>
    </main>
  );
}
