import { Schema, model } from 'mongoose';
import type { IComplaint } from '../interfaces/complaint.interface';

const ComplaintSchema = new Schema<IComplaint>({
  userId: { type: String, required: true }, // Referencing the user submitting the complaint
  description: {
    originalText: { type: String, required: true },
    languageCode: { type: String, required: true, default: 'en' },
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String },
  },
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['IMAGE', 'VOICE'], required: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  // AI Analysis fully decoupled - initializes as PENDING
  aiAnalysis: {
    category: { type: String },
    urgencyScore: { type: Number },
    sentiment: { type: String },
    summary: { type: String },
    analyzedAt: { type: Date },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

// Geo-spatial index for location-based queries
ComplaintSchema.index({ location: '2dsphere' });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ 'location.district': 1 });

export const Complaint = model<IComplaint>('Complaint', ComplaintSchema);
