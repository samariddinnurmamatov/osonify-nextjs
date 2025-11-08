import { useQuery } from "@tanstack/react-query";
import { browserApi } from "@/shared/api/client";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: () => browserApi.get<{ ok: boolean }>("/ping"),
  });
}
