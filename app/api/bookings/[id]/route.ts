import { NextRequest, NextResponse } from 'next/server';
import { bookingController } from '@/app/controllers/booking.controller';
import { getAuthenticatedUser } from '@/app/lib/utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.trim() === '') {
      return NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 });
    }

    const result = await bookingController.cancelBooking(id, user.userId, user.role);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: statusCode }
    );
  }
}
