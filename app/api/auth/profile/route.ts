import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { userController } from '@/app/controllers/user.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      throw error;
    }

    const userId = (session.user as any).id;
    const result = await userController.getProfile(userId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      throw error;
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const result = await userController.updateProfile(userId, body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status }
    );
  }
}
