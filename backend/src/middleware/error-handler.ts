import { Context } from 'hono';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof ZodError) {
    return c.json({ success: false, error: 'Validation Error', details: err.errors }, 400);
  }
  console.error(err);
  return c.json({ success: false, error: err.message || 'Server Error' }, 500);
};
