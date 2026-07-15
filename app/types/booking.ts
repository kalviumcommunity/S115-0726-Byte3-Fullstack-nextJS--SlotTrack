import { BookingStatus } from '../generated/prisma';

// TODO: Define strict Booking interfaces/types
export interface BookingType {
  id: string;
  userId: string;
  classId: string;
  status: BookingStatus;
  bookedAt: Date;
  cancelledAt: Date | null;
  createdAt: Date;
}
