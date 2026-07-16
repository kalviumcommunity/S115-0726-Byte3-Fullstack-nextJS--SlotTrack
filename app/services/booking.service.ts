import { bookingRepository } from '../repositories/booking.repository';
import { BookingStatus, Role } from '../generated/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/utils';

export const bookingService = {
  // Implement booking creation
  async createBooking(userId: string, classId: string): Promise<any> {
    // 1. Check if the class exists
    const fitnessClass = await bookingRepository.findClassById(classId);
    if (!fitnessClass) {
      throw new NotFoundError(`Fitness class with ID ${classId} does not exist.`);
    }

    // 2. Check if the user exists
    const user = await bookingRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} does not exist.`);
    }

    // 3. Check if available seats are already 0
    if (fitnessClass.availableSeats <= 0) {
      throw new ConflictError("The selected class is already fully booked.");
    }

    // 4. Check if duplicate active booking already exists
    const existingBooking = await bookingRepository.findUniqueBooking(userId, classId);
    if (existingBooking && existingBooking.status === BookingStatus.ACTIVE) {
      throw new ConflictError("You have already booked a slot in this class.");
    }

    // 5. Execute transaction to create booking and decrement seats
    return bookingRepository.createBookingWithSeatDecrement(userId, classId, existingBooking);
  },

  // Implement listing bookings filtered by user and role
  async getBookings(userId: string, role: Role): Promise<any[]> {
    if (role === Role.ADMIN) {
      return bookingRepository.findAll();
    } else {
      return bookingRepository.findByUserId(userId);
    }
  },

  // Implement getting paginated booking history for a user
  async getHistory(userId: string, query: { page: number; limit: number }): Promise<any> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [records, total] = await bookingRepository.findByUserIdPaginated(userId, skip, limit);

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
  },

  // Implement booking cancellation
  async cancelBooking(id: string, userId: string, role: Role): Promise<any> {
    // 1. Check if booking exists
    const booking = await bookingRepository.findById(id);
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
    return bookingRepository.cancelBookingWithSeatIncrement(id, booking.classId);
  }
};
