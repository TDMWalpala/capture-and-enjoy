import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/authApi";

export const authKeys = { me: ["me"] as const };

export function useCurrentUser() {
  return useQuery({ queryKey: authKeys.me, queryFn: authApi.getCurrentUser, staleTime: 30_000 });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.loginWithGoogle(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => queryClient.clear(),
  });
}
