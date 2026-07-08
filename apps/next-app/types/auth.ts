export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data?: User;
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin';
}
