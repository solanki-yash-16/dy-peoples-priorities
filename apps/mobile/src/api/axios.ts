import axios from 'axios';
import { storage } from '../utils/storage';

export const api = axios.create({
  baseURL: 'https://dy-peoples-priorities.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // You could handle 401 Unauthorized globally here to clear token,
    // e.g., if token expires
    if (error.response?.status === 401) {
      // We will handle token removal in the AuthStore so it can update UI
    }
    return Promise.reject(error);
  }
);
