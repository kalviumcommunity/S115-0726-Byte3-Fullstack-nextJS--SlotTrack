import prisma from '../lib/prisma';
import { User } from '../generated/prisma';

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: { name: string }): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  },
};
