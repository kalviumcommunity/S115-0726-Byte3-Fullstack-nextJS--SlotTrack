import { z } from 'zod';

const ageSchema = z.preprocess(
  (val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return undefined;
      return Number(trimmed);
    }
    return val;
  },
  z
    .number({ message: 'Age is required' })
    .refine((val) => !isNaN(val), { message: 'Age must be a valid number' })
    .refine((val) => Number.isInteger(val), { message: 'Age must be a whole number' })
    .refine((val) => val >= 13, { message: 'Age must be at least 13' })
    .refine((val) => val <= 120, { message: 'Age must be at most 120' })
);

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.string().optional(),
  employeeId: z.string().optional(),
  gender: z.string().optional(),
  age: ageSchema,
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  gender: z.string().optional(),
  age: ageSchema.optional(),
});

// Placeholders for other schemas to prevent compile errors
export const classSchema = z.any();
export const bookingSchema = z.any();
