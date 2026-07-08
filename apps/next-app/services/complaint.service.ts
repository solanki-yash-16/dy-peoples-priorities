import { apiClient } from '../lib/api-client';
import { Complaint, ComplaintStats, HeatmapPoint } from '../types/complaint';

export interface GetComplaintsParams {
  page?: number;
  limit?: number;
  sort?: string;
  district?: string;
  status?: string;
  category?: string;
  search?: string;
}

export const complaintService = {
  async getComplaints(params: GetComplaintsParams = {}): Promise<{ success: boolean; data: Complaint[]; total: number }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });
    
    const response = await apiClient.get(`/v1/complaints?${searchParams.toString()}`);
    const data = response.data.data || response.data;
    
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
      total: response.data.total || data.length || 0,
    };
  },

  async getStats(): Promise<ComplaintStats> {
    const response = await apiClient.get<{ success: boolean; data: ComplaintStats }>('/v1/complaints/stats');
    return response.data.data;
  },

  async getHeatmap(): Promise<HeatmapPoint[]> {
    const response = await apiClient.get<{ success: boolean; data: HeatmapPoint[] }>('/v1/complaints/heatmap');
    return response.data.data;
  },

  async getById(id: string): Promise<Complaint> {
    const response = await apiClient.get<{ success: boolean; data: Complaint }>(`/v1/complaints/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<Complaint> {
    const response = await apiClient.patch<{ success: boolean; data: Complaint }>(`/v1/complaints/${id}/status`, { status });
    return response.data.data;
  }
};
