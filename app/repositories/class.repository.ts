import prisma from '../lib/prisma';
import { FitnessClass } from '../generated/prisma';
import { measureSpan } from '../lib/perf-logger';

export const classRepository = {
  // Find all fitness classes matching filters, ordered by startTime ascending
  async findAll(filters?: { category?: string; location?: string; instructorId?: string; includePast?: boolean }): Promise<Omit<FitnessClass, 'createdAt' | 'updatedAt'>[]> {
    return measureSpan('REPOSITORY', 'classRepository.findAll', async () => {
      const where: any = {};

      if (!filters?.includePast) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        where.startTime = {
          gte: startOfToday,
        };
      }

      if (filters?.instructorId) {
        where.instructorId = filters.instructorId;
      }

      if (filters?.category) {
        where.category = filters.category;
      }
      if (filters?.location) {
        const loc = filters.location.toLowerCase();
        if (loc === "bangalore") {
          where.OR = [
            { location: { contains: "Bangalore", mode: "insensitive" } },
            { location: { contains: "Indiranagar", mode: "insensitive" } },
            { location: { contains: "Koramangala", mode: "insensitive" } },
            { location: { contains: "HSR", mode: "insensitive" } },
          ];
        } else if (loc === "mumbai") {
          where.OR = [
            { location: { contains: "Mumbai", mode: "insensitive" } },
            { location: { contains: "Bandra", mode: "insensitive" } },
            { location: { contains: "Andheri", mode: "insensitive" } },
            { location: { contains: "Powai", mode: "insensitive" } },
          ];
        } else {
          where.location = { contains: filters.location, mode: "insensitive" };
        }
      }

      const classes = await prisma.fitnessClass.findMany({
        where,
        orderBy: {
          startTime: 'asc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          instructor: true,
          instructorId: true,
          instructorUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              employeeId: true,
              gender: true,
              age: true,
            },
          },
          category: true,
          imageUrl: true,
          location: true,
          detailedLocation: true,
          startTime: true,
          endTime: true,
          capacity: true,
          availableSeats: true,
          price: true,
        },
      });

      return classes.map((cls) => {
        const safeAvailable = Math.min(cls.capacity, Math.max(0, cls.availableSeats));
        return {
          ...cls,
          availableSeats: safeAvailable,
        };
      });
    });
  },

  // Find a fitness class by ID
  async findById(id: string): Promise<FitnessClass | null> {
    return measureSpan('REPOSITORY', 'classRepository.findById', async () => {
      const fitnessClass = await prisma.fitnessClass.findUnique({
        where: { id },
        include: {
          instructorUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              employeeId: true,
              gender: true,
              age: true,
            },
          },
        },
      });

      if (!fitnessClass) return null;

      if (!fitnessClass.instructorUser && fitnessClass.instructorId) {
        const user = await prisma.user.findUnique({
          where: { id: fitnessClass.instructorId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            employeeId: true,
            gender: true,
            age: true,
          },
        });
        if (user) {
          (fitnessClass as any).instructorUser = user;
        }
      }

      const safeAvailable = Math.min(fitnessClass.capacity, Math.max(0, fitnessClass.availableSeats));
      fitnessClass.availableSeats = safeAvailable;

      return fitnessClass;
    });
  },

  // Create a new fitness class
  async create(data: {
    title: string;
    description: string;
    instructor: string;
    instructorId?: string;
    category: string;
    imageUrl: string;
    location: string;
    detailedLocation?: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    availableSeats: number;
    price: number;
  }): Promise<FitnessClass> {
    return measureSpan('REPOSITORY', 'classRepository.create', async () => {
      return prisma.fitnessClass.create({
        data,
      });
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
      detailedLocation?: string;
      startTime?: Date;
      endTime?: Date;
      capacity?: number;
      availableSeats?: number;
      price?: number;
    }
  ): Promise<FitnessClass> {
    return measureSpan('REPOSITORY', 'classRepository.update', async () => {
      return prisma.fitnessClass.update({
        where: { id },
        data,
      });
    });
  },

  // Delete a fitness class
  async delete(id: string): Promise<FitnessClass> {
    return measureSpan('REPOSITORY', 'classRepository.delete', async () => {
      return prisma.fitnessClass.delete({
        where: { id },
      });
    });
  },

  // Count active bookings for a fitness class
  async countBookings(classId: string): Promise<number> {
    return measureSpan('REPOSITORY', 'classRepository.countBookings', async () => {
      return prisma.booking.count({
        where: {
          classId,
          status: 'ACTIVE',
        },
      });
    });
  },
};
