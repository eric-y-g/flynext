import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface UserPayload {
  userId: string;
}

interface GetResponse {
  hotels?: object[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<GetResponse>> {
  try {
    const user = verifyToken(request) as UserPayload | null;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hotels = await prisma.hotel.findMany({
      where: {
        ownerId: user.userId,
      },
    });

    return NextResponse.json({ hotels }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user-owned hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
