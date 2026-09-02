import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const AFS_API_BASE_URL = "https://advanced-flights-system.replit.app";
const API_KEY = process.env.AFS_API_KEY!;

interface UserPayload {
  userId: string;
}

interface BookingRequestBody {
  passportNumber: string;
  flightId: string;
}

interface CancelBookingRequestBody {
  flightBookingId: string;
}

interface Flight {
  origin: { city: string };
  destination: { city: string };
  price: number;
  departureTime: string;
}

interface AFSBookingResponse {
  bookingReference: string;
  ticketNumber: string;
  flights: Flight[];
}

// --- POST: Book a flight ---
export async function POST(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = userPayload.userId;

    const { passportNumber, flightId }: BookingRequestBody = await request.json();

    if (!passportNumber || !flightId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (passportNumber.length < 9) {
      return NextResponse.json({ error: "Passport number must be at least 9 characters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { firstName, lastName, email } = user;

    const bookingResponse = await fetch(`${AFS_API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        flightIds: [flightId],
        lastName,
        passportNumber,
      }),
    });

    if (!bookingResponse.ok) {
      const errorMessage = await bookingResponse.text();
      return NextResponse.json(
        { error: `Error booking flight: ${errorMessage}` },
        { status: bookingResponse.status }
      );
    }

    const booking: AFSBookingResponse = await bookingResponse.json();
    const bookings = [];

    for (const flight of booking.flights) {
      const newBooking = await prisma.flightBooking.create({
        data: {
          bookingReference: booking.bookingReference,
          lastName,
          origin: flight.origin.city,
          destination: flight.destination.city,
          price: flight.price,
          departureDate: new Date(flight.departureTime),
          ticketNumber: booking.ticketNumber,
          user: { connect: { userId } },
          status: "BOOKED",
        },
      });
      bookings.push(newBooking);
    }

    const notification = await prisma.notifications.create({
      data: {
        userId,
        message: `Your flight with booking reference ${booking.bookingReference} has been successfully booked.`,
      },
    });

    return NextResponse.json(
      { message: "Flight booked successfully", booking: bookings },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// --- PUT: Cancel a flight ---
export async function PUT(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = userPayload.userId;

    const { flightBookingId }: CancelBookingRequestBody = await request.json();

    if (!flightBookingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingLocal = await prisma.flightBooking.findUnique({ where: { flightBookingId } });

    if (!bookingLocal) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { bookingReference, lastName } = bookingLocal;

    const cancelResponse = await fetch(`${AFS_API_BASE_URL}/api/bookings/cancel`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingReference, lastName }),
    });

    if (!cancelResponse.ok) {
      const errorMessage = await cancelResponse.text();
      return NextResponse.json(
        { error: `Error cancelling flight: ${errorMessage}` },
        { status: cancelResponse.status }
      );
    }

    const cancelBooking = await cancelResponse.json();

    const updatedBooking = await prisma.flightBooking.update({
      where: { flightBookingId },
      data: { status: "CANCELLED" },
    });

    const notification = await prisma.notifications.create({
      data: {
        userId,
        message: `Your flight with booking reference ${bookingReference} has been successfully cancelled.`,
      },
    });

    return NextResponse.json(
      { message: "Flight cancelled successfully", booking: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// --- GET: Retrieve booking details ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingReference = searchParams.get("flightBookingId");

    if (!bookingReference) {
      return NextResponse.json({ error: "Missing flight booking ID" }, { status: 400 });
    }

    const booking = await prisma.flightBooking.findFirst({ where: { bookingReference } });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const afsResponse = await fetch(
      `${AFS_API_BASE_URL}/api/bookings/retrieve?lastName=${booking.lastName}&bookingReference=${booking.bookingReference}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!afsResponse.ok) {
      return NextResponse.json(
        { error: "Error retrieving booking details" },
        { status: afsResponse.status }
      );
    }

    const bookingDetails = await afsResponse.json();
    return NextResponse.json({ bookingDetails }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
