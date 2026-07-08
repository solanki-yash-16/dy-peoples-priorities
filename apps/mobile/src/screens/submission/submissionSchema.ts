import { z } from 'zod';

export const submissionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  village: z.string().min(1, 'Village is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
