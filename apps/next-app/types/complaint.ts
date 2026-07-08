export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintLocation {
  type: string;
  coordinates: number[]; // [lng, lat]
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface ComplaintDescription {
  originalText: string;
  languageCode: string;
}

export interface ComplaintMedia {
  url: string;
  type: 'IMAGE' | 'VOICE';
  uploadedAt: string;
  _id?: string;
}

export interface AIAnalysis {
  category?: string;
  urgencyScore?: number;
  sentiment?: string;
  summary?: string;
  analyzedAt?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface Complaint {
  _id: string;
  userId: string;
  description: ComplaintDescription;
  location: ComplaintLocation;
  media: ComplaintMedia[];
  aiAnalysis: AIAnalysis;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  user?: User;
}

export interface ComplaintStats {
  total: number;
  pending: number;
  resolved: number;
  inProgress: number;
  rejected: number;
  byCategory: { _id: string; count: number }[];
  byPriority: { _id: string; count: number }[];
  recent: Complaint[];
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}
