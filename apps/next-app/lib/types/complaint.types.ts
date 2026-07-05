export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface IMedia {
  url: string;
  type: 'IMAGE' | 'VOICE';
  uploadedAt: Date;
}

export interface IAIAnalysis {
  category?: string;
  urgencyScore?: number;
  sentiment?: string;
  summary?: string;
  analyzedAt?: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface IComplaint {
  _id: string;
  userId: string;
  description: {
    originalText: string;
    languageCode: string;
  };
  location: ILocation;
  media: IMedia[];
  aiAnalysis: IAIAnalysis;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}
