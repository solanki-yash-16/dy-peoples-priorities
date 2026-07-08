import axios from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from cookies
    const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Global error handler
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 401 && isAuthRoute) {
      // Let the page handle bad login credentials
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
