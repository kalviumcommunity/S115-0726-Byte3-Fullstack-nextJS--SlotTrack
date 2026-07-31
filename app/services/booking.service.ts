import { bookingRepository } from '../repositories/booking.repository';
import { BookingStatus, Role } from '../generated/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/utils';
import { measureSpan } from '../lib/perf-logger';

export const bookingService = {
  // Implement booking creation
  async createBooking(userId: string, classId: string): Promise<any> {
    return measureSpan('SERVICE', 'bookingService.createBooking', async () => {
      // 1. Parallelize independent pre-transaction checks
      const [fitnessClass, user, existingBooking] = await Promise.all([
        bookingRepository.findClassById(classId),
        bookingRepository.findUserById(userId),
        bookingRepository.findUniqueBooking(userId, classId),
      ]);

      if (!fitnessClass) {
        throw new NotFoundError(`Fitness class with ID ${classId} does not exist.`);
      }

      if (!user) {
        throw new NotFoundError(`User with ID ${userId} does not exist.`);
      }

      if (fitnessClass.availableSeats <= 0) {
        throw new ConflictError("The selected class is already fully booked.");
      }

      if (existingBooking && existingBooking.status === BookingStatus.ACTIVE) {
        throw new ConflictError("You have already booked a slot in this class.");
      }

      // 2. Execute transaction to create booking and decrement seats
      return bookingRepository.createBookingWithSeatDecrement(userId, classId, existingBooking);
    });
  },

  // Implement listing bookings filtered by user and role
  async getBookings(userId: string, role: Role): Promise<any[]> {
    return measureSpan('SERVICE', 'bookingService.getBookings', async () => {
      return bookingRepository.findByUserId(userId);
    });
  },

  // Implement getting paginated booking history for a user/admin
  async getHistory(userId: string, role: Role, query: { page: number; limit: number }): Promise<any> {
    return measureSpan('SERVICE', 'bookingService.getHistory', async () => {
      const { page, limit } = query;
      const skip = (page - 1) * limit;

      let records: any[], total: number;
      // Return only the logged-in user's own bookings for their personal profile history view.
      [records, total] = await bookingRepository.findByUserIdPaginated(userId, skip, limit);

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1
        }
      };
    });
  },

  // Implement booking cancellation
  async cancelBooking(id: string, userId: string, role: Role): Promise<any> {
    return measureSpan('SERVICE', 'bookingService.cancelBooking', async () => {
      // 1. Check if booking exists by booking ID or class ID
      let booking = await bookingRepository.findById(id);
      if (!booking) {
        booking = await bookingRepository.findUniqueBooking(userId, id);
      }
      if (!booking) {
        throw new NotFoundError(`Booking with ID ${id} does not exist.`);
      }

      // 2. Check ownership (Members can only cancel their own)
      if (role === Role.MEMBER && booking.userId !== userId) {
        throw new ForbiddenError("You are not authorized to cancel this booking.");
      }

      // 3. Check if booking is already CANCELLED
      if (booking.status === BookingStatus.CANCELLED) {
        throw new ConflictError("This booking is already cancelled.");
      }

      // 4. Execute atomic update
      return bookingRepository.cancelBookingWithSeatIncrement(booking.id, booking.classId);
    });
  }
};
