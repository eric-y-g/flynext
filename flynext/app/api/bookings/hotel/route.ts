import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

interface UserPayload {
  userId: string;
}

interface CancelBookingRequest {
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}

interface BookRoomRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}

// --- Cancel Booking ---
export async function PUT(request: NextRequest) {
  const { userId, roomId, checkInDate, checkOutDate }: CancelBookingRequest = await request.json();

  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const order = await prisma.hotelBooking.findUnique({
      where: {
        userId_roomId_checkInDate_checkOutDate: {
          userId,
          roomId,
          checkInDate,
          checkOutDate,
        },
      },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const room = await prisma.room.findUnique({ where: { roomId } });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const hotel = await prisma.hotel.findUnique({ where: { hotelId: room.hotelId } });
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    if (hotel.ownerId !== userPayload.userId && order.userId !== userPayload.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const updatedBooking = await prisma.hotelBooking.update({
      where: {
        userId_roomId_checkInDate_checkOutDate: {
          userId,
          roomId,
          checkInDate,
          checkOutDate,
        },
      },
      data: {
        status: "cancelled",
      },
    });

    await prisma.notifications.create({
      data: {
        userId,
        message: "Your hotel booking has been cancelled",
      },
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// --- Book Room ---
export async function POST(request: NextRequest) {
  const { roomId, checkInDate, checkOutDate }: BookRoomRequest = await request.json();

  if (!roomId || !checkInDate || !checkOutDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const restriction = await prisma.deavtivated.findUnique({ where: { roomId } });
    if (restriction) return NextResponse.json({ error: "Room is restricted" }, { status: 400 });

    const userId = user.userId;
    const room = await prisma.room.findUnique({ where: { roomId } });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const hotel = await prisma.hotel.findUnique({ where: { hotelId: room.hotelId } });
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    const type = await prisma.roomType.findUnique({
      where: {
        hotelId_typeName: {
          typeName: room.typeName,
          hotelId: room.hotelId,
        },
      },
    });

    const existingBooking = await prisma.hotelBooking.findUnique({
      where: {
        userId_roomId_checkInDate_checkOutDate: {
          userId,
          roomId,
          checkInDate: new Date(checkInDate),
          checkOutDate: new Date(checkOutDate),
        },
      },
    });

    if (existingBooking) {
      if (existingBooking.status === "cancelled") {
        const newBooking = await prisma.hotelBooking.update({
          where: {
            userId_roomId_checkInDate_checkOutDate: {
              userId,
              roomId,
              checkInDate: new Date(checkInDate),
              checkOutDate: new Date(checkOutDate),
            },
          },
          data: {
            status: "reserved",
          },
        });

        await prisma.notifications.create({
          data: {
            userId: hotel.ownerId,
            message: "Someone has booked your hotel.",
          },
        });

        return NextResponse.json(newBooking);
      } else if (existingBooking.status === "reserved") {
        return NextResponse.json({ error: "Room already booked" }, { status: 400 });
      } else if (existingBooking.status === "deactivated") {
        return NextResponse.json({ error: "Room deactivated" }, { status: 400 });
      }
    }

    const hotelBooking = await prisma.hotelBooking.create({
      data: {
        userId,
        roomId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        hotelId: room.hotelId,
        typeName: room.typeName,
        price: type?.pricePerNight ?? 0,
        status: "reserved",
      },
    });

    await prisma.notifications.create({
      data: {
        userId: hotel.ownerId,
        message: "Someone has booked your hotel.",
      },
    });

    return NextResponse.json(hotelBooking);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
