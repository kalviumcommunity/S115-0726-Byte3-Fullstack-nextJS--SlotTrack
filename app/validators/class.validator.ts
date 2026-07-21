import { z } from 'zod';

const createClassSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  instructor: z.string().min(1, { message: 'Instructor name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  imageUrl: z.string().url({ message: 'Invalid image URL' }),
  location: z.string().min(1, { message: 'Location is required' }),
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO datetime string' }),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO datetime string' }),
  capacity: z.number().int({ message: 'Capacity must be an integer' }).positive({ message: 'Capacity must be a positive integer' }),
  price: z.number({ message: 'Price is required' }).positive({ message: 'Price must be greater than 0' }),
}).refine(data => {
  return new Date(data.startTime) < new Date(data.endTime);
}, {
  message: 'Start time must be before end time',
  path: ['endTime']
});

const updateClassSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }).optional(),
  instructor: z.string().min(1, { message: 'Instructor name is required' }).optional(),
  category: z.string().min(1, { message: 'Category is required' }).optional(),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  location: z.string().min(1, { message: 'Location is required' }).optional(),
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO datetime string' }).optional(),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO datetime string' }).optional(),
  capacity: z.number().int({ message: 'Capacity must be an integer' }).positive({ message: 'Capacity must be a positive integer' }).optional(),
  price: z.number().positive().optional(),
}).refine(data => {
  if (data.startTime && data.endTime) {
    return new Date(data.startTime) < new Date(data.endTime);
  }
  return true;
}, {
  message: 'Start time must be before end time',
  path: ['endTime']
});

export const classValidator = {
  validateCreate(data: unknown) {
    const result = createClassSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map((err) => err.message).join(', ');
      const error = new Error(errorMsg) as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    return result.data;
  },

  validateUpdate(data: unknown) {
    const result = updateClassSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map((err) => err.message).join(', ');
      const error = new Error(errorMsg) as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    return result.data;
  },
};
