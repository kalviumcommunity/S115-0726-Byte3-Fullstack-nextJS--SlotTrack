import prisma from '../lib/prisma';
import { FitnessClass } from '../generated/prisma';

export const classRepository = {
  // Find all fitness classes matching filters, ordered by startTime ascending
  async findAll(filters?: { category?: string; location?: string }): Promise<Omit<FitnessClass, 'createdAt' | 'updatedAt'>[]> {
    const where: any = {};
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      if (loc === "bangalore") {
        where.location = { in: ["Indiranagar", "Koramangala"] };
      } else if (loc === "mumbai") {
        where.location = { in: ["Bandra Hub", "Andheri Studio", "Powai Center"] };
      } else {
        where.location = { contains: filters.location, mode: "insensitive" };
      }
    }

    return prisma.fitnessClass.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        category: true,
        imageUrl: true,
        location: true,
        startTime: true,
        endTime: true,
        capacity: true,
        availableSeats: true,
      },
    });
  },

  // Find a fitness class by ID
  async findById(id: string): Promise<FitnessClass | null> {
    return prisma.fitnessClass.findUnique({
      where: { id },
    });
  },

  // Create a new fitness class
  async create(data: {
    title: string;
    description: string;
    instructor: string;
    category: string;
    imageUrl: string;
    location: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    availableSeats: number;
  }): Promise<FitnessClass> {
    return prisma.fitnessClass.create({
      data,
    });
  },

  // Update a fitness class
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      instructor?: string;
      category?: string;
      imageUrl?: string;
      location?: string;
      startTime?: Date;
      endTime?: Date;
      capacity?: number;
      availableSeats?: number;
    }
  ): Promise<FitnessClass> {
    return prisma.fitnessClass.update({
      where: { id },
      data,
    });
  },

  // Delete a fitness class
  async delete(id: string): Promise<FitnessClass> {
    return prisma.fitnessClass.delete({
      where: { id },
    });
  },

  // Count active bookings for a fitness class
  async countBookings(classId: string): Promise<number> {
    return prisma.booking.count({
      where: {
        classId,
        status: 'ACTIVE',
      },
    });
  },
};
