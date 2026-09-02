import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}
export async function GET(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        roomId: id,
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
