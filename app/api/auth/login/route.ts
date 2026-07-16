import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/app/controllers/auth.controller';
import { encode } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = (await authController.login(body)) as {
      id: string;
      name: string;
      email: string;
      role: string;
    };

    const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'secret';
    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
    });

    const response = NextResponse.json({
      success: true,
      data: { user },
    });

    response.cookies.set('next-auth.session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
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
