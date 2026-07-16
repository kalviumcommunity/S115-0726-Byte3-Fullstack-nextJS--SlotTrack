import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { classController } from '@/app/controllers/class.controller';

export const dynamic = 'force-dynamic';

interface ErrorWithStatus {
  status?: number;
  message?: string;
}

// GET /api/classes/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await classController.getClassById(id);
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

// PATCH /api/classes/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const error = new Error('Unauthorized') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const role = (session.user as { role?: string }).role || '';
    const body = await request.json();

    const result = await classController.updateClass(id, body, role);
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

// DELETE /api/classes/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const error = new Error('Unauthorized') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const role = (session.user as { role?: string }).role || '';
    const result = await classController.deleteClass(id, role);
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
