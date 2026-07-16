import prisma from '../lib/prisma';
import { BookingStatus } from '../generated/prisma';
import { NotFoundError, ConflictError } from '../lib/utils';

export const bookingRepository = {
  // Find a fitness class by ID
  async findClassById(id: string): Promise<any> {
    return prisma.fitnessClass.findUnique({
      where: { id }
    });
  },

  // Find a user by ID
  async findUserById(id: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  // Find a specific unique booking by userId and classId
  async findUniqueBooking(userId: string, classId: string): Promise<any> {
    return prisma.booking.findUnique({
      where: {
        userId_classId: { userId, classId }
      }
    });
  },

  // Create a raw booking record
  async create(data: any): Promise<any> {
    return prisma.booking.create({
      data
    });
  },

  // Find all bookings with class details (for Admins)
  async findAll(): Promise<any[]> {
    return prisma.booking.findMany({
      include: {
        class: {
          select: {
            title: true,
            startTime: true,
            location: true
          }
        }
      },
      orderBy: { bookedAt: 'desc' }
    });
  },

  // Find bookings for a specific user (for Members own view)
  async findByUserId(userId: string): Promise<any[]> {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        class: {
          select: {
            title: true,
            startTime: true,
            location: true
          }
        }
      },
      orderBy: { bookedAt: 'desc' }
    });
  },

  // Find bookings for history with pagination and return [records, count]
  async findByUserIdPaginated(userId: string, skip: number, limit: number): Promise<[any[], number]> {
    return prisma.$transaction([
      prisma.booking.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { bookedAt: 'desc' },
        include: {
          class: {
            select: {
              title: true,
              startTime: true
            }
          }
        }
      }),
      prisma.booking.count({
        where: { userId }
      })
    ]);
  },

  // Find a booking by ID
  async findById(id: string): Promise<any> {
    return prisma.booking.findUnique({
      where: { id }
    });
  },

  // Update booking status directly
  async updateStatus(id: string, status: BookingStatus): Promise<any> {
    return prisma.booking.update({
      where: { id },
      data: { status }
    });
  },

  // Atomically create/reactivate booking and decrement class seats
  async createBookingWithSeatDecrement(userId: string, classId: string, existingBooking?: any): Promise<any> {
    return prisma.$transaction(async (tx) => {
      // 1. Lock and retrieve the class row to prevent race conditions
      const classes = await tx.$queryRaw<any[]>`
        SELECT id, capacity, "availableSeats" 
        FROM "FitnessClass" 
        WHERE id = ${classId} 
        FOR UPDATE
      `;

      if (!classes || classes.length === 0) {
        throw new NotFoundError(`Fitness class with ID ${classId} does not exist.`);
      }

      const currentClass = classes[0];
      if (currentClass.availableSeats <= 0) {
        throw new ConflictError("The selected class is already fully booked.");
      }

      let bookingRecord;
      if (existingBooking) {
        // Reactivate a cancelled booking
        bookingRecord = await tx.booking.update({
          where: { id: existingBooking.id },
          data: {
            status: BookingStatus.ACTIVE,
            bookedAt: new Date(),
            cancelledAt: null
          }
        });
      } else {
        // Create new booking record
        bookingRecord = await tx.booking.create({
          data: {
            userId,
            classId,
            status: BookingStatus.ACTIVE
          }
        });
      }

      // Decrement class seats by 1
      const updatedClass = await tx.fitnessClass.update({
        where: { id: classId },
        data: {
          availableSeats: {
            decrement: 1
          }
        }
      });

      return {
        booking: {
          id: bookingRecord.id,
          userId: bookingRecord.userId,
          classId: bookingRecord.classId,
          status: bookingRecord.status,
          bookedAt: bookingRecord.bookedAt
        },
        availableSeatsRemaining: updatedClass.availableSeats
      };
    });
  },

  // Atomically cancel booking and increment class seats
  async cancelBookingWithSeatIncrement(bookingId: string, classId: string): Promise<any> {
    return prisma.$transaction(async (tx) => {
      // Lock the associated class row
      const classes = await tx.$queryRaw<any[]>`
        SELECT id, capacity, "availableSeats" 
        FROM "FitnessClass" 
        WHERE id = ${classId} 
        FOR UPDATE
      `;

      if (!classes || classes.length === 0) {
        throw new NotFoundError(`Fitness class with ID ${classId} does not exist.`);
      }

      // Update booking status to CANCELLED and set cancelledAt
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date()
        }
      });

      // Increment class seats by 1
      const updatedClass = await tx.fitnessClass.update({
        where: { id: classId },
        data: {
          availableSeats: {
            increment: 1
          }
        }
      });

      return {
        id: updatedBooking.id,
        status: updatedBooking.status,
        cancelledAt: updatedBooking.cancelledAt,
        availableSeatsRemaining: updatedClass.availableSeats
      };
    });
  }
};
