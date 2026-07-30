import { bookingService } from '../services/booking.service';
import { bookingValidator } from '../validators/booking.validator';
import { Role } from '../generated/prisma';
import { measureSpan } from '../lib/perf-logger';

export const bookingController = {
  // Handle booking creation
  async createBooking(userId: string, data: any): Promise<any> {
    return measureSpan('CONTROLLER', 'bookingController.createBooking', async () => {
      const validatedData = bookingValidator.validateCreateBooking(data);
      return bookingService.createBooking(userId, validatedData.classId);
    });
  },

  // Handle retrieving bookings (all or user-filtered based on role)
  async getBookings(userId: string, role: Role): Promise<any[]> {
    return measureSpan('CONTROLLER', 'bookingController.getBookings', async () => {
      return bookingService.getBookings(userId, role);
    });
  },

  // Handle retrieving user/admin booking history with pagination
  async getHistory(userId: string, role: Role, query: any): Promise<any> {
    return measureSpan('CONTROLLER', 'bookingController.getHistory', async () => {
      const validatedQuery = bookingValidator.validateHistoryQuery(query);
      return bookingService.getHistory(userId, role, validatedQuery);
    });
  },

  // Handle booking cancellation
  async cancelBooking(id: string, userId: string, role: Role): Promise<any> {
    return measureSpan('CONTROLLER', 'bookingController.cancelBooking', async () => {
      return bookingService.cancelBooking(id, userId, role);
    });
  }
};

