import { request } from './client';
import { BookingType } from '@/app/types/booking';

export interface BookingHistoryResponse {
  records: (BookingType & {
    class: {
      title: string;
      startTime: string;
      endTime?: string;
      location?: string;
      category?: string;
    };
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getBookings(): Promise<BookingType[]> {
  return request<BookingType[]>('/api/bookings', {
    method: 'GET',
  });
}

export async function bookClass(classId: string): Promise<{ booking: BookingType; availableSeatsRemaining: number }> {
  return request<{ booking: BookingType; availableSeatsRemaining: number }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ classId }),
  });
}

export async function cancelBooking(id: string): Promise<{ id: string; status: string; availableSeatsRemaining: number }> {
  return request<{ id: string; status: string; availableSeatsRemaining: number }>(`/api/bookings/${id}`, {
    method: 'PATCH',
  });
}

export async function getBookingHistory(page = 1, limit = 10): Promise<BookingHistoryResponse> {
  return request<BookingHistoryResponse>(`/api/bookings/history?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
}
