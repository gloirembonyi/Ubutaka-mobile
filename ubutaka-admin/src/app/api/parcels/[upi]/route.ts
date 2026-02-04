
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ upi: string }> }
) {
  try {
    const { upi } = await params;
    // Decode UPI if it was encoded (though usually UPIs are safe in URL if slashes are handled, but Next.js params usually handle decoding)
    // However, UPI contains slashes (e.g. 1/03/...), which might be an issue in URL path params if not encoded.
    // If the frontend calls /api/parcels/1%2F03..., `upi` will be decoded.
    
    // Prisma query
    const parcel = await prisma.parcel.findUnique({
      where: { upi: decodeURIComponent(upi) },
    });

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json(parcel);
  } catch (error) {
    console.error("GET parcel error:", error);
    return NextResponse.json({ error: "Failed to fetch parcel" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ upi: string }> }
) {
  try {
    const { upi } = await params;
    const body = await request.json();
    
    // If verifying, generate certificate ID if missing
    let updateData = { ...body };
    
    if (body.status === "Verified" || body.isVerified === true) {
        // Ensure consistent state
        updateData.status = "Verified";
        updateData.isVerified = true;
        
        // Generate certificate ID if not provided and not existing
        if (!body.certificateId) {
             // Check if it already has one
             const current = await prisma.parcel.findUnique({
                 where: { upi: decodeURIComponent(upi) },
                 select: { certificateId: true }
             });
             
             if (!current?.certificateId) {
                 const year = new Date().getFullYear();
                 const random = Math.floor(1000 + Math.random() * 9000);
                 updateData.certificateId = `CERT-${year}-${random}`;
                 updateData.verifiedAt = new Date();
             }
        }
    }

    const parcel = await prisma.parcel.update({
      where: { upi: decodeURIComponent(upi) },
      data: updateData,
    });

    return NextResponse.json(parcel);
  } catch (error) {
    console.error("PATCH parcel error:", error);
    return NextResponse.json({ error: "Failed to update parcel" }, { status: 500 });
  }
}
