import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/utils/auth";

const ACCESS_TOKEN_EXPIRATION = "1d";
const REFRESH_TOKEN_EXPIRATION = "7d";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequestBody = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 404 });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const payload: JwtPayload = {
      userId: user.userId,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json(
      { error: "A server error occurred while logging in" },
      { status: 500 }
    );
  }
}
