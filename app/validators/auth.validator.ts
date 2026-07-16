import { registerSchema, loginSchema } from '../lib/validations';

export const authValidator = {
  validateRegister(data: unknown) {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map((err) => err.message).join(', ');
      const error = new Error(errorMsg) as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    return result.data;
  },

  validateLogin(data: unknown) {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = result.error.issues.map((err) => err.message).join(', ');
      const error = new Error(errorMsg) as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    return result.data;
  },
};
