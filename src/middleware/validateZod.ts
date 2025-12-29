import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

/**
 * Middleware to validate request body using a Zod schema.
 * Returns 400 with formatted error messages if validation fails.
 */
export const validateZod = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // Format errors for client-friendly output
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ errors });
  }
  req.body = result.data; // Use parsed data
  next();
};

/**
 * Middleware to validate route params using a Zod schema.
 */
export const validateZodParam = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ errors });
  }
  // Cast result.data to ParamsDictionary
  req.params = result.data as ParamsDictionary;
  next();
};

/**
 * Middleware to validate query params using a Zod schema.
 */
export const validateZodQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ errors });
  }
  req.query = result.data as ParsedQs;
  next();
};