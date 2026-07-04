import { useState, useCallback } from "react";
import { APP_CONSTANTS } from "../utils/constants";

export interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));

    if (
      username === APP_CONSTANTS.STATIC_CREDENTIALS.username &&
      password === APP_CONSTANTS.STATIC_CREDENTIALS.password
    ) {
      setState({
        isAuthenticated: true,
        user: { username, role: "admin" },
        isLoading: false,
      });
      return true;
    }

    setState((prev) => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return { ...state, login, logout };
};
