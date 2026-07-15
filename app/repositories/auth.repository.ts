import prisma from '../lib/prisma';

export const authRepository = {
  // TODO: Implement finding a user by email using prisma
  async findByEmail(email: string): Promise<any> {
    // prisma.user.findUnique(...)
    return null;
  },

  // TODO: Implement creating a new user using prisma
  async createUser(data: any): Promise<any> {
    // prisma.user.create(...)
    return null;
  }
};
