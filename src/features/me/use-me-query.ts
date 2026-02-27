"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const result = await api.me.get();
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
