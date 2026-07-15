import { bookingService } from '../services/booking.service';

export const bookingController = {
  // TODO: Handle booking creation
  async createBooking(data: any): Promise<any> {
    return bookingService.createBooking(data);
  },

  // TODO: Handle retrieving bookings
  async getBookings(): Promise<any[]> {
    return bookingService.getBookings();
  },

  // TODO: Handle retrieving user's booking history
  async getHistory(userId: string): Promise<any[]> {
    return bookingService.getHistory(userId);
  },

  // TODO: Handle booking cancellation
  async cancelBooking(id: string): Promise<any> {
    return bookingService.cancelBooking(id);
  }
};
