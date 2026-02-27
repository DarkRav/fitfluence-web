"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppButton, PageHeader } from "@/shared/ui";
import { useAuth } from "@/features/auth/use-auth";

const loginSchema = z.object({
  confirm: z
    .boolean()
    .refine((value) => value, { message: "Подтвердите доступ к административной панели" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      confirm: false,
    },
  });

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

  const onSubmit = form.handleSubmit(async () => {
    setIsLoading(true);
    try {
      await auth.signIn();
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
      <section className="w-full rounded-lg border border-border bg-card p-8 shadow-card">
        <PageHeader title="Вход" subtitle="Авторизация через корпоративный Keycloak." />
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-card text-secondary focus:ring-ring/45"
              {...form.register("confirm")}
            />
            Я подтверждаю доступ к защищенной панели
          </label>
          {form.formState.errors.confirm ? (
            <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
          ) : null}
          <AppButton className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Перенаправляем..." : "Sign in"}
          </AppButton>
        </form>
      </section>
    </main>
  );
}
