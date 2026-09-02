import {prisma} from '@/utils/db'
import {NextResponse, NextRequest} from "next/server";
import { verifyToken } from "@/utils/auth";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

/*
Uploads a Cloudinary-hosted image for a specific RoomType.

Receives JSON in the form:
{
    "hotelId": "hotel123",
    "typeName": "Standard Queen",
    "secure_url": "https://res.cloudinary.com/...",
    "public_id": "room_uploads/abc123"
}
*/
export async function POST(request: NextRequest) {   
    try{
        //authentication
        const userPayload = verifyToken(request);
        if(!userPayload){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Params
        const { hotelId, typeName, secure_url, public_id } = await request.json();
        if(!hotelId || !typeName || !secure_url || !public_id){
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // Check if the hotel exists
        const hotel = await prisma.hotel.findUnique({ where: { hotelId: hotelId } });
        if (!hotel) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }
        if(hotel.ownerId !== userPayload.userId){
            return NextResponse.json({ error: "Not owner of hotel" }, { status: 401 });
        }

        // Check if the roomType exists
        const roomType = await prisma.roomType.findUnique({
            where: {
              hotelId_typeName: {
                hotelId,
                typeName
              }
            }
          });
        if(!roomType){
            return NextResponse.json({ error: "RoomType not found" }, { status: 404 });
        }
        // Create new room image
        await prisma.roomImage.create({
            data: {
              hotelId,
              typeName,
              picture: secure_url,
              pictureId: public_id,
            }
          });

        return NextResponse.json({message: "Successful roomTypeImage"}, { status: 201 });
    }
    catch(error){
        return NextResponse.json(error);
    }
}

/*
Deletes a room image (Cloudinary + DB) based on hotel ownership and pictureId.

Receives JSON in the form:
{
  "hotelId": "hotel123",
  "typeName": "Standard Queen",
  "pictureId": "room_uploads/abc123"
}
*/
export async function DELETE(request: NextRequest){
    try{
        // Verify token
        const userPayload = verifyToken(request);
        if(!userPayload){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Params
        const { hotelId, typeName, pictureId } = await request.json();
        if(!hotelId || !typeName || !pictureId){
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { userId: userPayload.userId } });
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // Check if the hotel exists
        const hotel = await prisma.hotel.findUnique({ where: { hotelId: hotelId } });
        if (!hotel) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }
        if(hotel.ownerId !== userPayload.userId){
            return NextResponse.json({ error: "Not owner of hotel" }, { status: 401 });
        }
        // Check if the roomType exists
        const roomType = await prisma.roomType.findUnique({
            where: {
              hotelId_typeName: {
                hotelId,
                typeName
              }
            }
          });
        if(!roomType){
            return NextResponse.json({ error: "RoomType not found" }, { status: 404 });
        }
        // Check if the roomImage exists
        const roomImage = await prisma.roomImage.findFirst({
            where: {
              hotelId,
              typeName,
              pictureId
            }
          });
        if(!roomImage){
            return NextResponse.json({ error: "RoomImage not found" }, { status: 404 });
        }
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(roomImage.pictureId);
        // Delete the image from the database
        await prisma.roomImage.delete({
            where: {
                    hotelId,
                    typeName,
                    pictureId
            }
        });
        return NextResponse.json({message: "RoomImage deleted"}, { status: 200 });
    }catch(error){
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
}