import { z } from 'zod';

export const createComplaintSchema = z.object({
  body: z.object({
    description: z.object({
      originalText: z.string().min(10, 'Description must be at least 10 characters long'),
      languageCode: z.string().length(2, 'Must be a valid 2-letter language code (e.g., en, hi)'),
    }),
    location: z.object({
      coordinates: z.tuple([
        z.number({ message: 'Longitude is required' }), 
        z.number({ message: 'Latitude is required' })
      ]),
      address: z.string().optional(),
      village: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    }),
    media: z.array(z.object({
      url: z.string().url('Must be a valid URL'),
      type: z.enum(['IMAGE', 'VOICE'])
    })).optional().default([]),
  })
});

export type CreateComplaintDTO = z.infer<typeof createComplaintSchema>['body'];
