"use client";

import { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { normalizeApiError } from "@/api/httpClient";
import { AppToastProvider, useAppToast } from "@/shared/ui";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }

  const normalized = normalizeApiError(error);
  return normalized.kind === "network";
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const { pushToast } = useAppToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const normalized = normalizeApiError(error);
            pushToast({
              kind: "error",
              title: "Ошибка запроса",
              description: normalized.message,
            });
          },
        }),
        defaultOptions: {
          queries: {
            retry: shouldRetry,
          },
          mutations: {
            retry: shouldRetry,
            onError: (error) => {
              const normalized = normalizeApiError(error);
              pushToast({
                kind: "error",
                title: "Ошибка операции",
                description: normalized.message,
              });
            },
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppToastProvider>
      <QueryProvider>{children}</QueryProvider>
    </AppToastProvider>
  );
}
