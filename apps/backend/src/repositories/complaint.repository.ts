import { Complaint } from '../models/Complaint.js';
import type { IComplaint } from '../interfaces/complaint.interface.js';
import type { PipelineStage } from 'mongoose';

export class ComplaintRepository {
  async create(data: Partial<IComplaint>): Promise<IComplaint> {
    const complaint = new Complaint(data);
    return await complaint.save();
  }

  async find(
    query: Record<string, unknown>,
    skip: number = 0,
    limit: number = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: IComplaint[]; total: number }> {
    const [data, total] = await Promise.all([
      Complaint.find(query).sort(sort).skip(skip).limit(limit).exec(),
      Complaint.countDocuments(query).exec()
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IComplaint | null> {
    return await Complaint.findById(id).exec();
  }

  async updateById(id: string, update: Record<string, unknown>): Promise<IComplaint | null> {
    return await Complaint.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async aggregate(pipeline: PipelineStage[]): Promise<unknown[]> {
    return await Complaint.aggregate(pipeline).exec();
  }

  async deleteById(id: string): Promise<IComplaint | null> {
    return await Complaint.findByIdAndDelete(id).exec();
  }
}
