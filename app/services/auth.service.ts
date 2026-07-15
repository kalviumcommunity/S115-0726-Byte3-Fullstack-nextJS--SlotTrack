import { authRepository } from '../repositories/auth.repository';

export const authService = {
  // TODO: Implement login service logic
  async login(data: any): Promise<any> {
    // Delegate to authRepository
    // const user = await authRepository.findByEmail(data.email);
    return null;
  },

  // TODO: Implement registration service logic
  async register(data: any): Promise<any> {
    // Delegate to authRepository
    // const user = await authRepository.createUser(data);
    return null;
  }
};
