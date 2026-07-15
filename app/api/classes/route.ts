import { NextRequest, NextResponse } from 'next/server';
import { classController } from '@/app/controllers/class.controller';

export async function GET(request: NextRequest) {
  try {
    // TODO: Retrieve all fitness classes
    // const result = await classController.getClasses();
    // return NextResponse.json(result);
    return NextResponse.json({ message: 'Get classes endpoint not implemented' }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Create a new fitness class (Admin only role check)
    // const body = await request.json();
    // const result = await classController.createClass(body);
    // return NextResponse.json(result, { status: 201 });
    return NextResponse.json({ message: 'Create class endpoint not implemented' }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
