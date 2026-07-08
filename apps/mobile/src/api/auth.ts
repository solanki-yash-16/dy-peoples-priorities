import { api } from './axios';

export interface LoginRequest {
  email: string;
  password?: string; // Optional if using OAuth, but here we require it as per prompt
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  me: async (): Promise<MeResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};
