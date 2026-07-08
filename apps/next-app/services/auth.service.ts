import { apiClient } from '../lib/api-client';
import { User, LoginDTO, RegisterDTO, AuthResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', data);
    return response.data;
  },

  async getMe(): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.get<{ success: boolean; user: User }>('/v1/auth/me');
    return {
      success: response.data.success,
      data: response.data.user
    };
  },

  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
  },

  async forgotPassword(email: string): Promise<{ success: boolean; data: string }> {
    const response = await apiClient.post('/v1/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; data: string }> {
    const response = await apiClient.post('/v1/auth/reset-password', { token, newPassword });
    return response.data;
  }
};
