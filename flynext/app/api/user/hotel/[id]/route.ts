import {prisma} from '@/utils/db'
import {NextResponse, NextRequest} from "next/server";
import { verifyToken } from "@/utils/auth";

interface GetResponse {
    roomTypes?: any[];
    rooms?: any[];
    hotels?: any[];
    error?: string;
    hotelName?: string;
    location?: string;
    address?: string;
}
export async function GET(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
    try {
        // Verify the user's token
        const user = await verifyToken(request);
        
        // Extract the hotel ID from the URL
        const stuff = await params;
        const hotelId = stuff.id;
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const hotel = await prisma.hotel.findUnique({where:{ hotelId}});
        if(!hotel){
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }
        if(user.userId !== hotel?.ownerId){
            return NextResponse.json({ error: "Not hotel Owner" }, { status: 401 });
        }
        
        // Get the user's bookings from the database
        const types = await prisma.roomType.findMany({
            where: {
                hotelId
            }
        });

        const rooms = await prisma.room.findMany({
            where: {
                hotelId
            }
        });

        const hotelImage = await prisma.hotelImage.findMany({where:{
            hotelId
        }});

        // Prepare the response object with room types and rooms
        const response = {
            roomTypes: types,
            rooms: rooms,
            hotelName: hotel.name,
            location: hotel.location,
            address: hotel.address,
            hotelImage: hotelImage
        };

        // Return the response in the NextResponse
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching user's hotel bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}