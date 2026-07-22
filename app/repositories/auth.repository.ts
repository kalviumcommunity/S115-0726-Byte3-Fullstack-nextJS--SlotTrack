import prisma from '../lib/prisma';
import { User } from '../generated/prisma';

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findByEmployeeId(employeeId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { employeeId },
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'MEMBER' | 'ADMIN';
    employeeId?: string;
    gender?: string;
    age?: number | null;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role || 'MEMBER',
        employeeId: data.employeeId || null,
        gender: data.gender || null,
        age: data.age !== undefined && data.age !== null ? Number(data.age) : null,
      },
    });
  },
};
