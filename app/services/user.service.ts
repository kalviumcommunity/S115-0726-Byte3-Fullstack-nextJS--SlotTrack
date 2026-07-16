import { userRepository } from '../repositories/user.repository';
import { userValidator } from '../validators/user.validator';

export const userService = {
  async getProfile(id: string): Promise<unknown> {
    if (!id) {
      const error = new Error('Unauthorized') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateProfile(id: string, data: unknown): Promise<unknown> {
    if (!id) {
      const error = new Error('Unauthorized') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    // 1. Validate request payload
    const validatedData = userValidator.validateProfileUpdate(data);

    // 2. Check if user exists
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    // 3. Update user profile name
    const updatedUser = await userRepository.update(id, { name: validatedData.name });

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
};
