import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '@/utils/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface UserPayload {
  userId: string;
}

interface UploadImageBody {
  hotelId: string;
  secure_url: string;
  public_id: string;
}

interface DeleteImageBody {
  hotelId: string;
  public_id: string;
}

// POST - Add hotel image
export async function POST(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hotelId, secure_url, public_id }: UploadImageBody = await request.json();

    if (!hotelId || !secure_url || !public_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Not owner of hotel' }, { status: 401 });
    }

    await prisma.hotelImage.create({
      data: {
        hotelId,
        picture: secure_url,
        pictureId: public_id,
      },
    });

    return NextResponse.json({ message: 'Hotel Image added' }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading hotel image:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove hotel image
export async function DELETE(request: NextRequest) {
  try {
    const userPayload = verifyToken(request) as UserPayload | null;
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hotelId, public_id }: DeleteImageBody = await request.json();
    if (!hotelId || !public_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hotel = await prisma.hotel.findUnique({ where: { hotelId } });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.ownerId !== userPayload.userId) {
      return NextResponse.json({ error: 'Not owner of hotel' }, { status: 401 });
    }

    const hotelImage = await prisma.hotelImage.findUnique({ where: { pictureId: public_id } });
    if (!hotelImage) {
      return NextResponse.json({ error: 'Hotel image not found' }, { status: 404 });
    }

    if (hotelImage.hotelId !== hotelId) {
      return NextResponse.json({ error: 'Hotel image does not belong to hotel' }, { status: 401 });
    }

    await cloudinary.uploader.destroy(public_id);
    await prisma.hotelImage.delete({ where: { pictureId: public_id } });

    return NextResponse.json({ message: 'Hotel Image deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting hotel image:', error);
    return NextResponse.json(
      { error: 'A server error occurred while deleting image' },
      { status: 500 }
    );
  }
}
