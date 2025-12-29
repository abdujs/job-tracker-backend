import { z } from 'zod';

// For validating :id route param (must be a string UUID or numeric string, adjust as needed)
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Example: For query params (e.g., pagination)
export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
