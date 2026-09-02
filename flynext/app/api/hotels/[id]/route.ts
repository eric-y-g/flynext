import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

// Type for route params
interface Params {
  params: {
    id: string;
  };
}

// GET available rooms for hotel
export async function GET(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  try {
    const bookings = await prisma.hotelBooking.findMany({
      where: {
        status: 'reserved',
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkOutDate ? new Date(checkOutDate) : undefined } },
              { checkOutDate: { gte: checkInDate ? new Date(checkInDate) : undefined } },
            ],
          },
          {
            AND: [
              { checkInDate: { lte: checkOutDate ? new Date(checkOutDate) : undefined } },
              { checkOutDate: { gte: checkOutDate ? new Date(checkOutDate) : undefined } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: checkInDate ? new Date(checkInDate) : undefined } },
              { checkOutDate: { lte: checkOutDate ? new Date(checkOutDate) : undefined } },
            ],
          },
          {
            AND: [
              { checkInDate: { lte: checkInDate ? new Date(checkInDate) : undefined } },
              { checkOutDate: { gte: checkOutDate ? new Date(checkOutDate) : undefined } },
            ],
          },
        ],
      },
    });

    const occupiedRoomIds = bookings.map((booking) => booking.roomId);

    const occupiedRooms = await prisma.room.findMany({
      where: {
        roomId: {
          in: occupiedRoomIds,
        },
      },
    });

    const rooms = await prisma.room.findMany({
      where: {
        hotelId: id,
      },
    });

    const buffer = rooms.filter(
      (room) => !occupiedRooms.some((occupiedRoom) => occupiedRoom.roomId === room.roomId)
    );

    const deactivated = await prisma.deavtivated.findMany();
    const deactivatedRoomIds = deactivated.map((item) => item.roomId);
    const availableRooms = buffer.filter((room) => !deactivatedRoomIds.includes(room.roomId));

    return NextResponse.json(availableRooms);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE hotel
export async function DELETE(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const { id: hotelId } = await params;

  try {
    const userPayload = verifyToken(request) as { userId: string } | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Unauthorized, not owner of hotel' }, { status: 401 });
    }

    await prisma.hotel.delete({
      where: { hotelId },
    });

    return NextResponse.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// PUT (update hotel details)
export async function PUT(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const { id: hotelId } = await params;

  try {
    const userPayload = verifyToken(request) as { userId: string } | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Unauthorized, not owner of hotel' }, { status: 401 });
    }

    const data: Partial<{ name: string; address: string; location: string; starRating: number }> =
      await request.json();

    const updatedHotel = await prisma.hotel.update({
      where: { hotelId },
      data,
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
