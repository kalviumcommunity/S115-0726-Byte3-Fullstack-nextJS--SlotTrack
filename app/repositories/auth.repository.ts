import prisma from '../lib/prisma';
import { User } from '../generated/prisma';

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: 'MEMBER', // Default role
      },
    });
  },
};
