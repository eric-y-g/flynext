import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface UserPayload {
  userId: string;
}

interface DeactivateRequestBody {
  number: number;
  hotelId: string;
  roomType: string;
}

// GET all deactivated rooms for a hotel (with auth)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');

  try {
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

    if(!hotelId){
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
    }

    const hotel = await prisma.hotel.findFirst({ where: { hotelId } });
    if (!hotel || hotel.ownerId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deactivatedRooms = await prisma.deavtivated.findMany({
      where: { hotelId },
    });

    return NextResponse.json(deactivatedRooms);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch deactivated rooms' }, { status: 500 });
  }
}

// POST - Deactivate rooms
export async function POST(request: NextRequest) {
  try {
    const { number, hotelId, roomType }: DeactivateRequestBody = await request.json();

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

    if (typeof number !== 'number' || number <= 0) {
      return NextResponse.json({ error: 'Number must be a positive integer' }, { status: 400 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Not owner of hotel' }, { status: 401 });
    }

    const deactivatedRooms = await prisma.deavtivated.findMany();

    const rooms = await prisma.room.findMany({
      where: {
        hotelId,
        typeName: roomType,
        NOT: {
          roomId: {
            in: deactivatedRooms.map((d) => d.roomId),
          },
        },
      },
    });

    if (rooms.length < number) {
      return NextResponse.json(
        { error: 'Deactivate request exceeds available rooms' },
        { status: 401 }
      );
    }

    const roomsToDeactivate = rooms.slice(0, number);
    const roomIds = roomsToDeactivate.map((room) => room.roomId);

    const deactivateOps = roomIds.map((roomId) =>
      prisma.deavtivated.create({
        data: {
          roomId,
          hotelId,
          typeName: roomType,
        },
      })
    );

    const block = await prisma.$transaction(deactivateOps);

    await prisma.hotelBooking.updateMany({
      where: {
        roomId: { in: roomIds },
        status: 'reserved',
      },
      data: {
        status: 'cancelled',
      },
    });

    const affectedBookings = await prisma.hotelBooking.findMany({
      where: {
        roomId: { in: roomIds },
        status: 'cancelled',
      },
      select: {
        userId: true,
        roomId: true,
      },
    });

    const notifyUsers = affectedBookings.map((booking) =>
      prisma.notifications.create({
        data: {
          userId: booking.userId,
          message: `Your booking has been cancelled due to room unavailability.`,
        },
      })
    );

    await Promise.all(notifyUsers);

    return NextResponse.json('Availability decreased successfully.');
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

// DELETE - Reactivate a deactivated room
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  try {
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

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

    await prisma.deavtivated.delete({
      where: { roomId },
    });

    return NextResponse.json('Room reactivated successfully');
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to reactivate room' }, { status: 500 });
  }
}
