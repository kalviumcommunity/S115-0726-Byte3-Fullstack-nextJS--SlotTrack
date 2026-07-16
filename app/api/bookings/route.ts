import { NextRequest, NextResponse } from 'next/server';
import { bookingController } from '@/app/controllers/booking.controller';
import { getAuthenticatedUser } from '@/app/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await bookingController.getBookings(user.userId, user.role);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Request body must be valid JSON' }, { status: 400 });
    }

    const result = await bookingController.createBooking(user.userId, body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: statusCode }
    );
  }
}
