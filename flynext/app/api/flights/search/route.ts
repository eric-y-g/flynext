import { NextRequest, NextResponse } from "next/server";

const AFS_API_BASE_URL = "https://advanced-flights-system.replit.app";
const API_KEY = process.env.AFS_API_KEY;

// Define flight structure if needed
interface Flight {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  duration: number;
  price: number;
  currency: string;
  availableSeats: number;
  status: string;
  airline: {
    code: string;
    name: string;
  };
}

interface AFSResponse {
  results: {
    flights: Flight;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const originAirport = searchParams.get("originAirport");
    const destination = searchParams.get("destination");
    const destinationAirport = searchParams.get("destinationAirport");
    const date = searchParams.get("date");
    const returnDate = searchParams.get("returnDate");
    const tripType = searchParams.get("tripType");

    // Required field checks
    if (!origin || !destination || !date || !tripType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (tripType === "roundTrip" && !returnDate) {
      return NextResponse.json(
        { error: "Missing return date" },
        { status: 400 }
      );
    }

    if (returnDate && tripType !== "roundTrip") {
      return NextResponse.json(
        { error: "Return date is only required for round trip" },
        { status: 400 }
      );
    }

    if (returnDate && new Date(returnDate) <= new Date(date)) {
      return NextResponse.json(
        { error: "Return date must be after the departure date" },
        { status: 400 }
      );
    }

    // --- Fetch outbound flights ---
    console.log(`Fetching outbound flights from AFS...`);
    const outboundRes = await fetch(
      `${AFS_API_BASE_URL}/api/flights?origin=${origin}&destination=${destination}&date=${date}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!outboundRes.ok) {
      return NextResponse.json(
        { message: "AFS API error", status: outboundRes.status },
        { status: outboundRes.status }
      );
    }

    const outboundData: AFSResponse = await outboundRes.json();

    let outboundFlights = outboundData.results.map((r) => r.flights);

    outboundFlights = outboundFlights.filter((flight) => {
      const matchesOrigin = originAirport
        ? flight.origin.code.toLowerCase() === originAirport.toLowerCase()
        : true;
      const matchesDest = destinationAirport
        ? flight.destination.code.toLowerCase() === destinationAirport.toLowerCase()
        : true;
      return matchesOrigin && matchesDest;
    });

    console.log("Filtered outbound flights:", outboundFlights.length);

    // --- Fetch return flights if round-trip ---
    let returnFlights: Flight[] = [];

    if (tripType === "roundTrip" && returnDate) {
      console.log(`Fetching return flights from AFS...`);

      const returnRes = await fetch(
        `${AFS_API_BASE_URL}/api/flights?origin=${destination}&destination=${origin}&date=${returnDate}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!returnRes.ok) {
        return NextResponse.json(
          { message: "AFS API error", status: returnRes.status },
          { status: returnRes.status }
        );
      }

      const returnData: AFSResponse = await returnRes.json();

      returnFlights = returnData.results.map((r) => r.flights).filter((flight) => {
        const matchesOrigin = destinationAirport
          ? flight.origin.code.toLowerCase() === destinationAirport.toLowerCase()
          : true;
        const matchesDest = originAirport
          ? flight.destination.code.toLowerCase() === originAirport.toLowerCase()
          : true;
        return matchesOrigin && matchesDest;
      });

      console.log("Filtered return flights:", returnFlights.length);
    }

    return NextResponse.json(
      {
        outboundFlights,
        inboundFlights: returnFlights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching for flights:", error);
    return NextResponse.json(
      { error: "Error searching for flights, Internal Server Error" },
      { status: 500 }
    );
  }
}
