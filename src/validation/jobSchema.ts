import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTEDz']),
  description: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.string().optional(), // or z.date().optional() if you handle dates
});