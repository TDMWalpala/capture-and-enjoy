import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { googleApi } from "@/services/googleApi";

export const googleKeys = { status: ["google", "status"] as const };

export function useGoogleConnection() {
  return useQuery({ queryKey: googleKeys.status, queryFn: googleApi.status });
}

export function useConnectGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => googleApi.connect(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: googleKeys.status }),
  });
}

export function useDisconnectGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => googleApi.disconnect(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: googleKeys.status }),
  });
}
