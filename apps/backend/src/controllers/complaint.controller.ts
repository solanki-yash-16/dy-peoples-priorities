import { Request, Response } from 'express';
import { ComplaintService } from '../services/complaint.service.js';

const complaintService = new ComplaintService();

export class ComplaintController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'anonymous_user';
      const complaint = await complaintService.createComplaint(userId, req.body);
      
      return res.status(201).json({
        status: 'success',
        data: complaint
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sort = '-createdAt',
        district,
        village,
        status,
        category,
        priority,
        startDate,
        endDate
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      
      const filters: Record<string, string> = {};
      if (district) filters.district = String(district);
      if (village) filters.village = String(village);
      if (status) filters.status = String(status);
      if (category) filters.category = String(category);
      if (priority) filters.priority = String(priority);
      if (startDate) filters.startDate = String(startDate);
      if (endDate) filters.endDate = String(endDate);

      const result = await complaintService.getComplaints(filters, skip, Number(limit), String(sort));
      
      return res.status(200).json({
        status: 'success',
        pagination: {
          total: result.total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(result.total / Number(limit))
        },
        data: result.data
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const complaint = await complaintService.getComplaintById(id);
      
      if (!complaint) {
        return res.status(404).json({
          status: 'error',
          message: 'Complaint not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: complaint
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ status: 'error', message: 'Status is required' });
      }

      const updated = await complaintService.updateComplaintStatus(id, status);
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Complaint not found' });
      }

      return res.status(200).json({ status: 'success', data: updated });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await complaintService.getStats();
      return res.status(200).json({ status: 'success', data: stats[0] });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getHeatmap(req: Request, res: Response) {
    try {
      const heatmapData = await complaintService.getHeatmap();
      return res.status(200).json({ status: 'success', data: heatmapData });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
