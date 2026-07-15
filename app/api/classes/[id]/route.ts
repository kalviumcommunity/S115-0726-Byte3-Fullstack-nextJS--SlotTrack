import { NextRequest, NextResponse } from 'next/server';
import { classController } from '@/app/controllers/class.controller';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Delegate retrieving class by id to classController
    // const result = await classController.getClassById(id);
    // return NextResponse.json(result);
    return NextResponse.json({ message: `Get class details for ID ${id} not implemented` }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Delegate class update to classController
    // const body = await request.json();
    // const result = await classController.updateClass(id, body);
    // return NextResponse.json(result);
    return NextResponse.json({ message: `Update class for ID ${id} not implemented` }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Delegate class deletion to classController
    // const result = await classController.deleteClass(id);
    // return NextResponse.json(result);
    return NextResponse.json({ message: `Delete class for ID ${id} not implemented` }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
