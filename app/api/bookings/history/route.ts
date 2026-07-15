import { NextRequest, NextResponse } from 'next/server';
import { bookingController } from '@/app/controllers/booking.controller';

export async function GET(request: NextRequest) {
  try {
    // TODO: Retrieve booking history for the authenticated user
    // const userId = "session-user-id";
    // const result = await bookingController.getHistory(userId);
    // return NextResponse.json(result);
    return NextResponse.json({ message: 'Get booking history endpoint not implemented' }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
