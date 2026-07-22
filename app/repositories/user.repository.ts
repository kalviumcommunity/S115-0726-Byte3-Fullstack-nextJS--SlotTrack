import prisma from '../lib/prisma';
import { User } from '../generated/prisma';

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: { name?: string; gender?: string; age?: number | null }): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.age !== undefined && { age: data.age }),
      },
    });
  },
};
