import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerName = searchParams.get('ownerName');
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    if (ownerName) {
      whereClause.ownerName = { equals: ownerName, mode: 'insensitive' };
    }
    if (status) {
      whereClause.status = { equals: status, mode: 'insensitive' };
    }

    const parcels = await prisma.parcel.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(parcels);
  } catch (error) {
    const err = error as Error;
    console.error("GET parcels error:", err);
    return NextResponse.json({ error: "Failed to fetch parcels", details: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parcel = await prisma.parcel.create({
      data: {
        upi: body.upi,
        size: body.size,
        use: body.use,
        district: body.district,
        sector: body.sector || null,
        cell: body.cell || null,
        village: body.village || null,
        location: body.location,
        status: body.status || "Pending Verification",
        ownerName: body.ownerName,
        imageUrl: body.imageUrl,
        price: body.price || null,
        coordinates: body.coordinates ? JSON.stringify(body.coordinates) : null,
        documents: body.documents ? JSON.stringify(body.documents) : null,
        partners: body.partners || null,
        children: body.children || null,
        userId: body.userId || null,
      },
    });
    return NextResponse.json(parcel);
  } catch (error) {
    console.error("POST parcel error:", error);
    return NextResponse.json({ error: "Failed to create parcel" }, { status: 500 });
  }
}
