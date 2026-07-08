import type { CreateComplaintDTO } from '../schemas/complaint.schema.js';
import { ComplaintRepository } from '../repositories/complaint.repository.js';

export class ComplaintService {
  private repository: ComplaintRepository;

  constructor() {
    this.repository = new ComplaintRepository();
  }

  async createComplaint(userId: string, data: CreateComplaintDTO) {
    return await this.repository.create({
      userId,
      description: data.description,
      location: {
        type: 'Point',
        coordinates: data.location.coordinates,
        address: data.location.address,
        village: data.location.village,
        district: data.location.district,
        state: data.location.state,
        country: data.location.country,
      },
      media: data.media?.map(m => ({
        url: m.url,
        type: m.type,
        uploadedAt: new Date()
      })) || [],
    });
  }

  async getComplaints(filters: Record<string, string> = {}, skip: number = 0, limit: number = 10, sortStr: string = '-createdAt') {
    const query: Record<string, unknown> = {};
    
    if (filters.district) query['location.district'] = filters.district;
    if (filters.village) query['location.village'] = filters.village;
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.priority) query.priority = filters.priority;
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.startDate) dateFilter.$gte = new Date(filters.startDate);
      if (filters.endDate) dateFilter.$lte = new Date(filters.endDate);
      query.createdAt = dateFilter;
    }

    // Build sort object from string like "-createdAt,priority"
    const sortParams: Record<string, 1 | -1> = {};
    sortStr.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        sortParams[field.substring(1)] = -1;
      } else {
        sortParams[field] = 1;
      }
    });

    return await this.repository.find(query, skip, limit, sortParams);
  }

  async getComplaintById(id: string) {
    return await this.repository.findById(id);
  }

  async updateComplaintStatus(id: string, status: string, aiAnalysis?: Record<string, unknown>) {
    const updatePayload: Record<string, unknown> = { status };
    if (aiAnalysis) {
      updatePayload.aiAnalysis = aiAnalysis;
    }
    return await this.repository.updateById(id, updatePayload);
  }

  async updateComplaint(id: string, update: Record<string, unknown>) {
    return await this.repository.updateById(id, update);
  }

  async deleteComplaint(id: string) {
    return await this.repository.deleteById(id);
  }

  async getStats() {
    return await this.repository.aggregate([
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ]
        }
      }
    ]);
  }

  async getHeatmap() {
    // Return array of objects with lat, lng, weight (e.g. 1)
    const pipeline = [
      {
        $project: {
          lat: { $arrayElemAt: ['$location.coordinates', 1] },
          lng: { $arrayElemAt: ['$location.coordinates', 0] },
          weight: { $literal: 1 } // Can be adjusted based on priority later
        }
      }
    ];
    return await this.repository.aggregate(pipeline);
  }
}
