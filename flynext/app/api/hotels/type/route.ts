import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface UserPayload {
  userId: string;
}

interface CreateRoomTypeBody {
  typeName: string;
  hotelId: string;
  amenities: string[];
  pricePerNight: number;
}

export async function POST(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      typeName,
      hotelId,
      amenities,
      pricePerNight,
    }: CreateRoomTypeBody = await request.json();

    if (!typeName || !hotelId || !amenities || !pricePerNight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Do not own hotel' },
        { status: 401 }
      );
    }

    const newRoomType = await prisma.roomType.create({
      data: {
        typeName,
        hotelId,
        amenities: Array.isArray(amenities) ? amenities.join(',') : amenities,
        pricePerNight,
      },
    });

    return NextResponse.json(newRoomType);
  } catch (error) {
    console.error('Error creating room type:', error);
    return NextResponse.json(
      { error: 'Error creating room type' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Missing hotelId parameter' },
        { status: 400 }
      );
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

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json(
        { error: 'Do not own hotel' },
        { status: 401 }
      );
    }

    const hotelTypes = await prisma.roomType.findMany({
      where: { hotelId },
    });

    const types = hotelTypes.map((type) => type.typeName);

    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching room types:', error);
    return NextResponse.json(
      { error: 'Error getting roomType' },
      { status: 500 }
    );
  }
}
