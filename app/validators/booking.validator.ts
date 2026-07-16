import { z } from 'zod';
import { ValidationError } from '../lib/utils';

const createBookingSchema = z.object({
  classId: z.string({
    message: "Class ID is required"
  }).min(1, "Class ID cannot be empty")
});

const bookingHistorySchema = z.object({
  page: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    },
    z.number().int().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    },
    z.number().int().positive().max(100).default(10)
  )
});

export const bookingValidator = {
  validateCreateBooking(data: any) {
    if (!data) {
      throw new ValidationError("Request body is missing");
    }
    const result = createBookingSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map(err => err.message).join(", ");
      throw new ValidationError(errorMsg);
    }
    return result.data;
  },

  validateHistoryQuery(query: any) {
    const result = bookingHistorySchema.safeParse(query);
    if (!result.success) {
      const errorMsg = result.error.issues.map(err => err.message).join(", ");
      throw new ValidationError(errorMsg);
    }
    return result.data;
  }
};
