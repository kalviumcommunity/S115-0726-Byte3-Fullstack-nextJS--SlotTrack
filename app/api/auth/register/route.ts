import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/app/controllers/auth.controller';

export async function POST(request: NextRequest) {
  try {
    // TODO: Delegate registration to authController
    // const body = await request.json();
    // const result = await authController.register(body);
    // return NextResponse.json(result);
    return NextResponse.json({ message: 'Register endpoint not implemented' }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
