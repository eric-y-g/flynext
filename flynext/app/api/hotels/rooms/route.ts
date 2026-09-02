import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface UserPayload {
  userId: string;
}

interface RoomRequestBody {
  roomNumber: number;
  hotelId: string;
  typeName: string;
}

export async function POST(request: NextRequest) {
  try {
    const { roomNumber, hotelId, typeName }: RoomRequestBody = await request.json();

    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userPayload.userId },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Not owner of Hotel' }, { status: 401 });
    }

    const newRoom = await prisma.room.create({
      data: {
        roomNumber,
        hotelId,
        typeName,
      },
    });

    return NextResponse.json(newRoom);
  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
