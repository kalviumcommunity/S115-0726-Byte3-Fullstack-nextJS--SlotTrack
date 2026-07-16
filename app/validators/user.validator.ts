import { profileUpdateSchema } from '../lib/validations';

export const userValidator = {
  validateProfileUpdate(data: unknown) {
    const result = profileUpdateSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map((err) => err.message).join(', ');
      const error = new Error(errorMsg) as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    return result.data;
  },
};
