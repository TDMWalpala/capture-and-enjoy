import { useQuery } from "@tanstack/react-query";
import { activityApi } from "@/services/activityApi";

export function useActivity() {
  return useQuery({ queryKey: ["activity"], queryFn: activityApi.list });
}
