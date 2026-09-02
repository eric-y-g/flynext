import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import bcrypt from "bcryptjs";

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
}

interface UserPayload {
  userId: string;
}

export async function GET(request: NextRequest) {
  try {
    const userPayload: UserPayload | null = verifyToken(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userPayload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("Error in fetching user details", error);
    return NextResponse.json(
      { error: "A server error occurred while fetching user data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userPayload: UserPayload | null = verifyToken(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userPayload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { firstName, lastName, password, phoneNumber }: UpdateUserRequest =
      await request.json();

    if (!firstName && !lastName && !password && !phoneNumber) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const userId = user.userId;
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
        ...(password?.trim()
          ? { password: await bcrypt.hash(password, 10) }
          : {}),
      },
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
      }, // Exclude password
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating user details", error);
    return NextResponse.json(
      { error: "A server error occurred while updating user data" },
      { status: 500 }
    );
  }
}
