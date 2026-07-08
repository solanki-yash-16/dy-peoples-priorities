import { apiClient } from '../lib/api-client';

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ status: string; url: string }>('/v1/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },

  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ status: string; url: string }>('/v1/uploads/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  }
};
