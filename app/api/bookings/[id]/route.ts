import { NextRequest, NextResponse } from 'next/server';
import { bookingController } from '@/app/controllers/booking.controller';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Delegate booking status update (e.g. cancellation) to bookingController
    // const result = await bookingController.cancelBooking(id);
    // return NextResponse.json(result);
    return NextResponse.json({ message: `Cancel booking for ID ${id} not implemented` }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
