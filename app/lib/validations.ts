import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.string().optional(),
  employeeId: z.string().optional(),
  gender: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  gender: z.string().optional(),
});

// Placeholders for other schemas to prevent compile errors
export const classSchema = z.any();
export const bookingSchema = z.any();
