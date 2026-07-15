import { userService } from '../services/user.service';

export const userController = {
  // TODO: Handle retrieving profile details
  async getProfile(id: string): Promise<any> {
    return userService.getProfile(id);
  },

  // TODO: Handle updating user profile info
  async updateProfile(id: string, data: any): Promise<any> {
    return userService.updateProfile(id, data);
  }
};
