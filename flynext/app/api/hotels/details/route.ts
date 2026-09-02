import {prisma} from '@/utils/db'
import {NextResponse} from "next/server";
import { verifyToken } from "@/utils/auth";

interface UserPayload {
    userId: string;
}

interface User {
    userId: string;
    [key: string]: any; // Allow for other properties
}

interface Hotel {
    hotelId: string;
    ownerId: string;
    [key: string]: any; // Allow for other properties
}


export async function GET(request: Request) {
        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId');
        
        if (!hotelId) {
                return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
        }
        
        try{
                const hotel = await prisma.hotel.findUnique({where:{hotelId : hotelId}}) as Hotel | null;
                if(!hotel){
                        return NextResponse.json({error: "Hotel not found"}, {status:404 })
                }
                // if (hotel.ownerId !== userPayload.userId){
                //         return NextResponse.json({ error: "Do not own hotel" }, { status: 401 });
                // }
                const hotelImage = await prisma.hotelImage.findMany({
                    where: {
                        hotelId
                    }
                });
        
                const answer = {"hotel":hotel, "image":hotelImage};
                return NextResponse.json(answer);
        }catch(error){
                return NextResponse.json({ error: 'Error getting roomType' }, { status: 500 });
        }
}