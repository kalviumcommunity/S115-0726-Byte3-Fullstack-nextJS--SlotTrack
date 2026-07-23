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
            id: true,
            title: true,
            startTime: true,
            endTime: true,
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
            id: true,
            title: true,
            startTime: true,
            endTime: true,
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
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              category: true,
              location: true
            }
          }
        }
      }),
      prisma.booking.count({
        where: { userId }
      })
    ]);
  },

  // Find all past fitness classes for Admin history view
  async findPastClassesPaginated(skip: number, limit: number): Promise<[any[], number]> {
    const now = new Date();
    return prisma.$transaction([
      prisma.fitnessClass.findMany({
        where: {
          startTime: { lt: now }
        },
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          category: true,
          location: true,
          instructor: true,
        }
      }),
      prisma.fitnessClass.count({
        where: {
          startTime: { lt: now }
        }
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
      const capacity = currentClass.capacity;
      const currentAvailable = currentClass.availableSeats;

      if (currentAvailable <= 0) {
        throw new ConflictError("The selected class is already fully booked.");
      }

      let bookingRecord;
      if (existingBooking) {
        // Verify current status within transaction lock
        const currentDbBooking = await tx.booking.findUnique({
          where: { id: existingBooking.id }
        });
        if (currentDbBooking && currentDbBooking.status === BookingStatus.ACTIVE) {
          throw new ConflictError("You have already booked a slot in this class.");
        }

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
        // Check for duplicate active booking within transaction lock
        const existingActive = await tx.booking.findFirst({
          where: {
            userId,
            classId,
            status: BookingStatus.ACTIVE
          }
        });
        if (existingActive) {
          throw new ConflictError("You have already booked a slot in this class.");
        }

        // Create new booking record
        bookingRecord = await tx.booking.create({
          data: {
            userId,
            classId,
            status: BookingStatus.ACTIVE
          }
        });
      }

      // Decrement class seats by 1, strictly bounded between 0 and capacity
      const newAvailable = Math.max(0, Math.min(capacity, currentAvailable - 1));
      const updatedClass = await tx.fitnessClass.update({
        where: { id: classId },
        data: {
          availableSeats: newAvailable
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
      // 1. Lock and retrieve the booking row to verify its status within the transaction
      const bookings = await tx.$queryRaw<any[]>`
        SELECT id, "userId", "classId", status 
        FROM "Booking" 
        WHERE id = ${bookingId} 
        FOR UPDATE
      `;

      if (!bookings || bookings.length === 0) {
        throw new NotFoundError(`Booking with ID ${bookingId} does not exist.`);
      }

      const currentBooking = bookings[0];

      // 2. Lock the associated class row
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
      const capacity = currentClass.capacity;
      const currentAvailable = currentClass.availableSeats;

      // IDEMPOTENCY CHECK: If booking is ALREADY CANCELLED, do NOT increment seats again!
      if (currentBooking.status === BookingStatus.CANCELLED) {
        const safeSeats = Math.min(capacity, Math.max(0, currentAvailable));
        if (currentAvailable !== safeSeats) {
          await tx.fitnessClass.update({
            where: { id: classId },
            data: { availableSeats: safeSeats }
          });
        }
        return {
          id: currentBooking.id,
          status: BookingStatus.CANCELLED,
          alreadyCancelled: true,
          availableSeatsRemaining: safeSeats
        };
      }

      // Update booking status to CANCELLED and set cancelledAt
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date()
        }
      });

      // Increment class seats by 1, strictly bounded by capacity: 0 <= availableSeats <= capacity
      const newAvailable = Math.min(capacity, Math.max(0, currentAvailable + 1));
      const updatedClass = await tx.fitnessClass.update({
        where: { id: classId },
        data: {
          availableSeats: newAvailable
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
