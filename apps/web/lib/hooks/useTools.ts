// lib/hooks/useTools.ts
import { useQuery } from "@tanstack/react-query";
import { getTools } from "@/lib/api/tools";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: getTools,
    staleTime: 1000 * 60 * 60, // this list barely changes — cache for an hour
  });
}