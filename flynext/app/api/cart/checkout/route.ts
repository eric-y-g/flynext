import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { prisma } from "@/utils/db";

// Define types for request and payload
interface UserPayload {
  userId: string;
}

interface CheckoutRequestBody {
  creditCardNumber: string;
  expiryDate: string;
  cvv: string;
  passportNumber: string;
}

interface HotelBookingItem {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight: number;
}

interface FlightBookingItem {
  flightId: string;
  flightTempId: string;
  price: number;
  origin: string;
  destination: string;
}

export async function POST(request: NextRequest) {
  try {
    const currentDate = new Date();
    const userPayload = verifyToken(request) as UserPayload | null;

    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authHeader = request.headers.get("Authorization");
    const userId = userPayload.userId;

    const {
      creditCardNumber,
      expiryDate,
      cvv,
      passportNumber,
    }: CheckoutRequestBody = await request.json();

    if (!creditCardNumber || !expiryDate || !cvv || !passportNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (creditCardNumber.length < 16) {
      return NextResponse.json(
        { error: "Credit card number must be at least 16 characters" },
        { status: 400 }
      );
    }

    if (cvv.length < 3 || cvv.length > 4) {
      return NextResponse.json(
        { error: "CVV must be between 3 and 4 characters" },
        { status: 400 }
      );
    }

    if (new Date(expiryDate) < currentDate) {
      return NextResponse.json(
        { error: "Credit card is expired" },
        { status: 400 }
      );
    }

    const failedBookings: any[] = [];
    const headers = {
      "Content-Type": "application/json",
      Authorization: authHeader || "",
    };
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successfulHotels: any[] = [];
    const successfulFlights: any[] = [];

    // --- Hotel Bookings ---
    const hotelRes = await fetch(`${baseUrl}/api/cart/hotel`, {
      method: "GET",
      headers,
    });

    let hotelCart: HotelBookingItem[] = [];
    if (hotelRes.ok) {
      hotelCart = await hotelRes.json();
    }

    for (const hotelItem of hotelCart) {
      const { roomId, checkInDate, checkOutDate, pricePerNight } = hotelItem;
      try {
        const res = await fetch(`${baseUrl}/api/bookings/hotel`, {
          method: "POST",
          headers,
          body: JSON.stringify({ roomId, checkInDate, checkOutDate }),
        });

        if (!res.ok) {
          const errMsg = await res.text();
          const failMsg = `Hotel booking from ${checkInDate} to ${checkOutDate} failed: ${errMsg}`;

          failedBookings.push({
            type: "hotel",
            roomId,
            price: pricePerNight,
            checkInDate,
            checkOutDate,
            error: errMsg,
          });

          await prisma.notifications.create({
            data: { userId, message: failMsg },
          });
        } else {
          await fetch(
            `${baseUrl}/api/cart/hotel?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
            { method: "DELETE", headers }
          );

          await prisma.notifications.create({
            data: {
              userId,
              message: `Your hotel booking from ${checkInDate} to ${checkOutDate} has been confirmed.`,
            },
          });

          successfulHotels.push({
            roomId,
            price: pricePerNight,
            checkInDate,
            checkOutDate,
          });
        }
      } catch (err) {
        const errorMsg = "Network or server error";

        failedBookings.push({
          type: "hotel",
          roomId,
          checkInDate,
          checkOutDate,
          error: errorMsg,
        });

        await prisma.notifications.create({
          data: {
            userId,
            message: `Hotel booking from ${checkInDate} to ${checkOutDate} failed: ${errorMsg}`,
          },
        });
      }
    }

    // --- Flight Bookings ---
    const flightRes = await fetch(`${baseUrl}/api/cart/flight`, {
      method: "GET",
      headers,
    });

    let flightCart: FlightBookingItem[] = [];
    if (flightRes.ok) {
      flightCart = await flightRes.json();
    }

    for (const flightItem of flightCart) {
      const { flightId, flightTempId, price, origin, destination } = flightItem;
      try {
        const res = await fetch(`${baseUrl}/api/bookings/flight`, {
          method: "POST",
          headers,
          body: JSON.stringify({ flightId, passportNumber }),
        });

        if (!res.ok) {
          const errMsg = await res.text();
          failedBookings.push({ type: "flight", flightId, error: errMsg });

          await prisma.notifications.create({
            data: {
              userId,
              message: `Flight booking for flight ${flightId} failed: ${errMsg}`,
            },
          });
        } else {
          await fetch(
            `${baseUrl}/api/cart/flight?flightTempId=${flightTempId}`,
            { method: "DELETE", headers }
          );

          await prisma.notifications.create({
            data: {
              userId,
              message: `Your flight booking for flight ${flightId} has been confirmed.`,
            },
          });

          successfulFlights.push({
            flightId,
            passportNumber,
            price,
            origin,
            destination,
          });
        }
      } catch (err) {
        const errorMsg = "Network or server error";
        failedBookings.push({ type: "flight", flightId, error: errorMsg });

        await prisma.notifications.create({
          data: {
            userId,
            message: `Flight booking for flight ${flightId} failed: ${errorMsg}`,
          },
        });
      }
    }

    // --- Create Invoice ---
    const totalFlightCost = successfulFlights.reduce(
      (sum, f) => sum + (f.price || 0),
      0
    );

    const getNights = (start: string, end: string): number => {
      const checkIn = new Date(start);
      const checkOut = new Date(end);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const totalHotelCost = hotelCart
      .filter((h) =>
        successfulHotels.find(
          (sh) =>
            sh.roomId === h.roomId &&
            sh.checkInDate === h.checkInDate &&
            sh.checkOutDate === h.checkOutDate
        )
      )
      .reduce((sum, h) => {
        const nights = getNights(h.checkInDate, h.checkOutDate);
        return sum + h.pricePerNight * nights;
      }, 0);

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        totalAmount: totalFlightCost + totalHotelCost,
        flights: successfulFlights,
        hotels: successfulHotels,
      },
    });

    console.log("Invoice created:", invoice);

    return NextResponse.json(
      {
        message:
          failedBookings.length === 0
            ? "All bookings successful!"
            : "Some bookings failed.",
        failedBookings,
        invoiceId: invoice.invoiceId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
