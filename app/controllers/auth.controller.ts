import { authService } from '../services/auth.service';

export const authController = {
  // TODO: Handle login requests
  async login(data: any): Promise<any> {
    return authService.login(data);
  },

  // TODO: Handle registration requests
  async register(data: any): Promise<any> {
    return authService.register(data);
  }
};
