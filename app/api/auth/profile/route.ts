import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/app/lib/auth-helper';
import { userController } from '@/app/controllers/user.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      throw error;
    }

    const result = await userController.getProfile(user.userId);

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
    const user = await getAuthenticatedUser(request);
    if (!user) {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      throw error;
    }

    const body = await request.json();
    const result = await userController.updateProfile(user.userId, body);

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
