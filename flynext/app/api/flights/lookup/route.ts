import { NextRequest, NextResponse } from "next/server";

const AFS_API_BASE_URL = "https://advanced-flights-system.replit.app";
const API_KEY = process.env.AFS_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get("flightId");

    if (!flightId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Looking up the flight from AFS");

    const afsResponse = await fetch(
      `${AFS_API_BASE_URL}/api/flights/${flightId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!afsResponse.ok) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    const flightResults = await afsResponse.json();
    return NextResponse.json(flightResults, { status: 200 });
  } catch (error) {
    console.error("AFS lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
