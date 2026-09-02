import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

interface UserPayload {
  userId: string;
}

interface HotelCartRequestBody {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  typeName: string;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      typeName,
      price,
    }: HotelCartRequestBody = await request.json();

    if (!roomId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userPayload.userId;
    const checkIn = `${checkInDate}T00:00:00Z`;
    const checkOut = `${checkOutDate}T00:00:00Z`;

    await prisma.hotelTemp.create({
      data: {
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        userId,
        pricePerNight: price,
        typeName,
      },
    });

    await prisma.notifications.create({
      data: {
        userId,
        message: `A new hotel has been added to your cart!`,
      },
    });

    return NextResponse.json(
      { message: "Hotel booking added to cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hotel POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");

    if (!roomId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.hotelTemp.delete({
      where: {
        userId_roomId_checkInDate_checkOutDate: {
          userId: userPayload.userId,
          roomId,
          checkInDate,
          checkOutDate,
        },
      },
    });

    return NextResponse.json(
      { message: "Hotel booking removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hotel DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userPayload.userId;
    const cartHotel = await prisma.hotelTemp.findMany({
      where: { userId },
    });

    return NextResponse.json(cartHotel, { status: 200 });
  } catch (error) {
    console.error("Hotel GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
