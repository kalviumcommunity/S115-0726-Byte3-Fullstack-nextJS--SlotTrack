import { userService } from '../services/user.service';

export const userController = {
  async getProfile(id: string, email?: string): Promise<unknown> {
    return userService.getProfile(id, email);
  },

  async updateProfile(id: string, data: unknown): Promise<unknown> {
    return userService.updateProfile(id, data);
  },
};
