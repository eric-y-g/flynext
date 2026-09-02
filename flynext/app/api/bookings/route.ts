import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

interface UserPayload {
  userId: string;
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userPayload.userId;

    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        flightBookings: true,
        hotelBooking: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        flightBookings: user.flightBookings,
        hotelBooking: user.hotelBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving booking details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
