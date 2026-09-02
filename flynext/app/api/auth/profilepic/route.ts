import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { v2 as cloudinary } from "cloudinary";

interface UserPayload {
  userId: string;
}

interface UploadRequestBody {
  secure_url: string;
  public_id: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// --- POST: Upload Profile Picture ---
export async function POST(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userPayload.userId;
    const user = await prisma.user.findUnique({ where: { userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { secure_url, public_id }: UploadRequestBody = await request.json();
    if (!secure_url || !public_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (user.profilePicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicId);
      } catch (error) {
        console.warn("Failed to delete old profile picture from Cloudinary", error);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        profilePic: secure_url,
        profilePicId: public_id,
      },
    });

    return NextResponse.json(
      {
        message: "Profile picture updated successfully",
        profilePic: updatedUser.profilePic,
        profilePicId: updatedUser.profilePicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "A server error occurred while uploading image" },
      { status: 500 }
    );
  }
}

// --- GET: Fetch Profile Picture ---
export async function GET(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userPayload.userId },
      select: { profilePic: true },
    });

    if (!user || !user.profilePic) {
      return NextResponse.json(
        { error: "No profile picture found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profilePic: user.profilePic }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return NextResponse.json(
      { error: "Server error while fetching profile picture" },
      { status: 500 }
    );
  }
}
