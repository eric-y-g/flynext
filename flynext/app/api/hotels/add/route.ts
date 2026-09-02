import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface HotelRequestBody {
  name: string;
  address: string;
  location: string;
  starRating: number;
}

interface UserPayload {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, location, starRating }: HotelRequestBody = await request.json();
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

    const existingCity = await prisma.city.findFirst({
      where: { name: location },
    });

    if (!existingCity) {
      return NextResponse.json(
        { error: 'Location not found in our database' },
        { status: 400 }
      );
    }

    const newHotel = await prisma.hotel.create({
      data: {
        name,
        address,
        location,
        starRating,
        ownerId: userPayload.userId,
      },
    });

    return NextResponse.json(newHotel);
  } catch (error: any) {
    console.error('Error creating hotel:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
