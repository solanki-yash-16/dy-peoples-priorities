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
  address: string;
  village: string;
  district: string;
}

export interface ComplaintDescription {
  text: string;
  mediaUrls: string[];
  audioUrl?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: ComplaintDescription;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  location: ComplaintLocation;
  createdAt: string;
  updatedAt: string;
  user: User;
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
