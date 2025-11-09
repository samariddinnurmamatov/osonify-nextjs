import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: () => api.get<{ ok: boolean }>("/ping"),
  });
}
