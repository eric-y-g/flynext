import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface RegisterRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
    }: RegisterRequestBody = await request.json();

    if (!password || !email || !firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Finding existing users");
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already associated with an account" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "A server error occurred while registering the user" },
      { status: 500 }
    );
  }
}
