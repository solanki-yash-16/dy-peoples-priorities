import type { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const complaintService = new ComplaintService();

export class ComplaintController {
  create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user?.id || 'anonymous_user';
    const complaint = await complaintService.createComplaint(userId, req.body);
    
    res.status(201).json({
      status: 'success',
      data: complaint
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
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
    
    res.status(200).json({
      status: 'success',
      pagination: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(result.total / Number(limit))
      },
      data: result.data
    });
  });

  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.params.id);
    const complaint = await complaintService.getComplaintById(id);
    
    if (!complaint) {
      return next(createError('Complaint not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: complaint
    });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return next(createError('Status is required', 400));
    }

    const updated = await complaintService.updateComplaintStatus(id, status);
    if (!updated) {
      return next(createError('Complaint not found', 404));
    }

    res.status(200).json({ status: 'success', data: updated });
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.params.id);
    
    const updated = await complaintService.updateComplaint(id, req.body);
    if (!updated) {
      return next(createError('Complaint not found', 404));
    }

    res.status(200).json({ status: 'success', data: updated });
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.params.id);
    
    const deleted = await complaintService.deleteComplaint(id);
    if (!deleted) {
      return next(createError('Complaint not found', 404));
    }

    res.status(200).json({ status: 'success', data: {} });
  });

  getStats = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await complaintService.getStats();
    res.status(200).json({ status: 'success', data: stats[0] });
  });

  getHeatmap = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const heatmapData = await complaintService.getHeatmap();
    res.status(200).json({ status: 'success', data: heatmapData });
  });
}
