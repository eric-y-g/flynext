import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";

interface RefreshTokenBody {
  refreshToken: string;
}

interface UserPayload {
  userId: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RefreshTokenBody = await request.json();

    const { refreshToken } = body;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken) as UserPayload | null;
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 400 }
      );
    }

    const payload: UserPayload = {
      userId: decoded.userId,
      email: decoded.email,
    };

    const accessToken = generateAccessToken(payload);
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error("Error in refresh route:", error);
    return NextResponse.json(
      { error: "A server error occurred while refreshing the token" },
      { status: 500 }
    );
  }
}
