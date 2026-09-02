import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

interface UserPayload {
  userId: string;
}

interface FlightCartRequestBody {
  flightId: string;
  origin: string;
  destination: string;
  price: number;
  departureDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      flightId,
      origin,
      destination,
      price,
      departureDate,
    }: FlightCartRequestBody = await request.json();

    if (
      !flightId ||
      !origin ||
      !destination ||
      price === undefined ||
      !departureDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const flightTemp = await prisma.flightTemp.create({
      data: {
        userId: userPayload.userId,
        flightId,
        origin,
        destination,
        price: parseFloat(String(price)),
        departureDate: new Date(departureDate),
      },
    });

    await prisma.notifications.create({
      data: {
        userId: userPayload.userId,
        message: `Flight ${flightId} (${origin} → ${destination}) added to cart!`,
      },
    });

    return NextResponse.json(flightTemp, { status: 200 });
  } catch (error) {
    console.error("Error in booking flight:", error);
    return NextResponse.json(
      { error: "A server error occurred while booking flight" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const flightTempId = url.searchParams.get("flightTempId");

    if (!flightTempId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.flightTemp.delete({
      where: {
        flightTempId,
      },
    });

    return NextResponse.json(
      { message: "Flight removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting cart item:", error);
    return NextResponse.json(
      { error: "A server error occurred while deleting cart item" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartFlights = await prisma.flightTemp.findMany({
      where: {
        userId: userPayload.userId,
      },
    });

    return NextResponse.json(cartFlights, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart flights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
