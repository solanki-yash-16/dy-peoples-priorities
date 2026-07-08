import { apiClient } from '../lib/api-client';
import { User } from '../types/auth';

export const userService = {
  async getUsers(page = 1, limit = 10, search?: string): Promise<{ success: boolean; data: User[]; total: number }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });
    
    const response = await apiClient.get(`/v1/users?${params.toString()}`);
    // Support either response.data.users, response.data.data or raw array
    const responseData = response.data.users || response.data.data || response.data;
    
    return {
      success: true,
      data: Array.isArray(responseData) ? responseData : [],
      total: response.data.total || response.data.pagination?.total || (Array.isArray(responseData) ? responseData.length : 0),
    };
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>(`/v1/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ success: boolean; data: User }>(`/v1/users/${id}`, userData);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/v1/users/${id}`);
  }
};
