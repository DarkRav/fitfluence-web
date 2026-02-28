"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/me";

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const result = await getMe();
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
