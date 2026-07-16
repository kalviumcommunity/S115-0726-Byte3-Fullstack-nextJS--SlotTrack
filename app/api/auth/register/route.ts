import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/app/controllers/auth.controller';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authController.register(body);
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
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
