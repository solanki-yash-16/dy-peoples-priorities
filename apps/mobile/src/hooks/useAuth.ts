import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth";
import { storage } from "../utils/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useAuth = () => {
  const { isAuthenticated, user, isInitializing, logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      await storage.removeToken();
      storeLogout();
      queryClient.clear();
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });
    }
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    isAuthenticated,
    user,
    isLoading: isInitializing || logoutMutation.isPending,
    logout
  };
};
