import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(request: NextRequest, { params } : { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hotelId: string | null = searchParams.get('hotelId');

    if (!hotelId) {
        return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
    }

    try {
        const type = await prisma.roomType.findFirst({
            where: {
                hotelId,
                typeName: id,
            }
        });

        const img = await prisma.roomImage.findMany({
            where: {
                hotelId,
                typeName: id,
            }
        });

        return NextResponse.json({ type, img });
    } catch (error) {
        console.error("Failed to fetch hotel type data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}