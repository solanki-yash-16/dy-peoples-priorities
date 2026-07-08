import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Location and mapping APIs
 */

/**
 * @swagger
 * /api/v1/location/reverse-geocode:
 *   get:
 *     summary: Reverse geocode coordinates to address
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successfully retrieved address details
 */
router.get('/reverse-geocode', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return next(createError('lat and lng are required', 400));
  }

  // In a real app, you would use your server-side API key from env
  // const apiKey = env.GOOGLE_MAPS_API_KEY;
  // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
  
  // For now, return a mock response if no key is configured
  return res.status(200).json({
    status: 'success',
    data: {
      address: 'Mock Address',
      village: 'Mock Village',
      district: 'Mock District',
      state: 'Mock State',
      country: 'Mock Country'
    }
  });
}));

export default router;
