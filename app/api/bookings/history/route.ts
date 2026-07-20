import { NextRequest, NextResponse } from 'next/server';
import { bookingController } from '@/app/controllers/booking.controller';
import { getAuthenticatedUser } from '@/app/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    const result = await bookingController.getHistory(user.userId, { page, limit });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: statusCode }
    );
  }
}
