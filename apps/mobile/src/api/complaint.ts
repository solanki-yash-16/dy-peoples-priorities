import { api } from './axios';

export interface SubmitComplaintRequest {
  description: {
    originalText: string;
    languageCode: string;
  };
  location: {
    type: string;
    coordinates: number[];
    address: string;
    village: string;
    district: string;
    state: string;
    country: string;
  };
  media: Array<{
    url: string;
    type: string;
  }>;
}

export interface Complaint {
  _id: string;
  userId: string;
  status: string;
  description: {
    originalText: string;
    languageCode: string;
  };
  location: {
    type: string;
    coordinates: number[];
    address?: string;
    village?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  media: Array<{
    _id: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  aiAnalysis?: {
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  status: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  data: T[];
}

export interface HeatmapPoint {
  _id: string;
  lat: number;
  lng: number;
  weight: number;
}

export interface GetComplaintsParams {
  page?: number;
  limit?: number;
  sort?: string;
  district?: string;
  status?: string;
}

export const complaintApi = {
  submitComplaint: async (data: SubmitComplaintRequest) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  getHeatmap: async (): Promise<{ status: string; data: HeatmapPoint[] }> => {
    const response = await api.get('/complaints/heatmap');
    return response.data;
  },

  getComplaints: async (params?: GetComplaintsParams): Promise<PaginatedResponse<Complaint>> => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/complaints/${id}/status`, { status });
    return response.data;
  },

  uploadImage: async (fileUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: 'upload.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAudio: async (fileUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: 'upload.m4a',
      type: 'audio/m4a',
    } as any);

    const response = await api.post('/uploads/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
