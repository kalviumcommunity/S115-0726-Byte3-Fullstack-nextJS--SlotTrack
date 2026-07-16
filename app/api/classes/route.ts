import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { classController } from '@/app/controllers/class.controller';

export const dynamic = 'force-dynamic';

interface ErrorWithStatus {
  status?: number;
  message?: string;
}

// GET /api/classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;

    const result = await classController.getClasses({ category, location });
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const err = error as ErrorWithStatus;
    const status = err.status || 500;
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal Server Error',
      },
      { status }
    );
  }
}

// POST /api/classes
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const error = new Error('Unauthorized') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const role = (session.user as { role?: string }).role || '';
    const body = await request.json();

    const result = await classController.createClass(body, role);
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as ErrorWithStatus;
    const status = err.status || 500;
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal Server Error',
      },
      { status }
    );
  }
}
