import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { Prisma } from '@prisma/client';

interface UserPayload {
  userId: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const roomType = searchParams.get('roomType');

  if (!hotelId) {
    return NextResponse.json(
      { error: 'Missing required query parameter: hotelId' },
      { status: 400 }
    );
  }

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

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Do not own hotel' }, { status: 401 });
    }

    // Build dynamic where clause
    const whereClause: Prisma.hotelBookingWhereInput = {
      hotelId,
    };

    if (roomType) {
      whereClause.typeName = roomType;
    }

    if (checkInDate) {
      whereClause.checkInDate = { gte: new Date(checkInDate) };
    }

    if (checkOutDate) {
      whereClause.checkOutDate = { lte: new Date(checkOutDate) };
    }

    const bookings = await prisma.hotelBooking.findMany({
      where: whereClause,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
