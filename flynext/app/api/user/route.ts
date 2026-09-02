import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

interface UserPayload {
  userId: string;
}

interface GetResponse {
  userInfo?: object | null;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<GetResponse>> {
  try {
    const user = verifyToken(request) as UserPayload | null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: {
        userId: user.userId,
      },
    });

    return NextResponse.json({ userInfo }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user's hotel bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
