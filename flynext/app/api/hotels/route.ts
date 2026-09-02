import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface HotelFilter {
  location?: string | null;
  name?: string | null;
  starRating?: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkInDate = searchParams.get("checkInDate");
  const checkOutDate = searchParams.get("checkOutDate");
  const location = searchParams.get("location");
  const name = searchParams.get("name");
  const starRating = searchParams.get("starRating");
  const priceRangeMax = searchParams.get("priceRangeMax");
  const priceRangeMin = searchParams.get("priceRangeMin");

  const hotelWhereClause: any = {};

  if (location) hotelWhereClause.location = location;
  if (name) hotelWhereClause.name = name;
  if (starRating) {
    const parsed = parseInt(starRating, 10);
    if (!isNaN(parsed)) {
      hotelWhereClause.starRating = parsed;
    }
  }

  try {
    // Step 1: Find conflicting bookings
    const bookings = await prisma.hotelBooking.findMany({
      where: {
        status: "reserved",
        OR: [
          {
            AND: [
              {
                checkInDate: {
                  lte: checkOutDate ? new Date(checkOutDate) : undefined,
                },
              },
              {
                checkOutDate: {
                  gte: checkInDate ? new Date(checkInDate) : undefined,
                },
              },
            ],
          },
          {
            AND: [
              {
                checkInDate: {
                  lte: checkOutDate ? new Date(checkOutDate) : undefined,
                },
              },
              {
                checkOutDate: {
                  gte: checkOutDate ? new Date(checkOutDate) : undefined,
                },
              },
            ],
          },
          {
            AND: [
              {
                checkInDate: {
                  gte: checkInDate ? new Date(checkInDate) : undefined,
                },
              },
              {
                checkOutDate: {
                  lte: checkOutDate ? new Date(checkOutDate) : undefined,
                },
              },
            ],
          },
          {
            AND: [
              {
                checkInDate: {
                  lte: checkInDate ? new Date(checkInDate) : undefined,
                },
              },
              {
                checkOutDate: {
                  gte: checkOutDate ? new Date(checkOutDate) : undefined,
                },
              },
            ],
          },
        ],
      },
    });

    // Step 2: Find room IDs that are occupied
    const occupiedRoomIds = bookings.map((booking) => booking.roomId);

    const occupiedRooms = await prisma.room.findMany({
      where: {
        roomId: {
          in: occupiedRoomIds,
        },
      },
    });

    // Step 3: Find all rooms in price range
    const rooms = await prisma.room.findMany({
      where: {
        roomType: {
          pricePerNight: {
            gte: priceRangeMin ? parseFloat(priceRangeMin) : undefined,
            lte: priceRangeMax ? parseFloat(priceRangeMax) : undefined,
          },
        },
      },
    });

    // Step 4: Filter to only available rooms
    const availableRooms = rooms.filter(
      (room) => !occupiedRooms.some((occupied) => occupied.roomId === room.roomId)
    );

    const availableHotelIds = availableRooms.map((room) => room.hotelId);

    // Step 5: Find hotels matching filters
    const hotels = await prisma.hotel.findMany({
      where: hotelWhereClause,
    });

    // Step 6: Filter hotels to those with available rooms
    const filteredHotels = hotels.filter((hotel) =>
      availableHotelIds.includes(hotel.hotelId)
    );

    return NextResponse.json(filteredHotels);
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
