import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createComplaintSchema } from '../schemas/complaint.schema.js';

const router: Router = Router();
const complaintController = new ComplaintController();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management
 */

/**
 * @swagger
 * /api/v1/complaints/stats:
 *   get:
 *     summary: Get complaint statistics
 *     tags: [Complaints, Dashboard]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', complaintController.getStats);

/**
 * @swagger
 * /api/v1/complaints/heatmap:
 *   get:
 *     summary: Get complaint heatmap data
 *     tags: [Complaints, Dashboard, Location]
 *     responses:
 *       200:
 *         description: Heatmap data retrieved successfully
 */
router.get('/heatmap', complaintController.getHeatmap);

/**
 * @swagger
 * /api/v1/complaints:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: object
 *               category:
 *                 type: string
 *               location:
 *                 type: object
 *     responses:
 *       201:
 *         description: Complaint created
 */
router.post(
  '/',
  validate(createComplaintSchema),
  complaintController.create
);

/**
 * @swagger
 * /api/v1/complaints:
 *   get:
 *     summary: Get complaints with filtering, pagination and sorting
 *     tags: [Complaints]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting (e.g. -createdAt)
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/', complaintController.getAll);

/**
 * @swagger
 * /api/v1/complaints/{id}:
 *   get:
 *     summary: Get a single complaint by ID
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complaint details
 */
router.get('/:id', complaintController.getById);

/**
 * @swagger
 * /api/v1/complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', complaintController.updateStatus);

export default router;
