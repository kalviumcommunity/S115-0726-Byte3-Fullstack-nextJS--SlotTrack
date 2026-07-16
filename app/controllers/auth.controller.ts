import { authService } from '../services/auth.service';

export const authController = {
  async login(data: unknown): Promise<unknown> {
    return authService.login(data);
  },

  async register(data: unknown): Promise<unknown> {
    return authService.register(data);
  },
};
