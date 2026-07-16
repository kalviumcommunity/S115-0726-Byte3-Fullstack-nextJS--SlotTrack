import { bookingService } from '../services/booking.service';
import { bookingValidator } from '../validators/booking.validator';
import { Role } from '../generated/prisma';

export const bookingController = {
  // Handle booking creation
  async createBooking(userId: string, data: any): Promise<any> {
    const validatedData = bookingValidator.validateCreateBooking(data);
    return bookingService.createBooking(userId, validatedData.classId);
  },

  // Handle retrieving bookings (all or user-filtered based on role)
  async getBookings(userId: string, role: Role): Promise<any[]> {
    return bookingService.getBookings(userId, role);
  },

  // Handle retrieving user's booking history with pagination
  async getHistory(userId: string, query: any): Promise<any> {
    const validatedQuery = bookingValidator.validateHistoryQuery(query);
    return bookingService.getHistory(userId, validatedQuery);
  },

  // Handle booking cancellation
  async cancelBooking(id: string, userId: string, role: Role): Promise<any> {
    return bookingService.cancelBooking(id, userId, role);
  }
};
