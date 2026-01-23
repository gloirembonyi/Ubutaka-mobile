import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(disputes);
  } catch (error) {
    console.error("GET disputes error:", error);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Find an Abunzi in the same village if possible
    let assignedAbunziId = null;
    if (body.village) {
      const abunzi = await prisma.user.findFirst({
        where: {
          role: "ABUNZI",
          village: body.village,
          isVerified: true
        } as any
      });
      if (abunzi) {
        assignedAbunziId = abunzi.id;
      }
    }

    const dispute = await prisma.dispute.create({
      data: {
        upi: body.upi,
        type: body.type,
        status: body.status || "Investigation",
        dateOpened: body.dateOpened || new Date().toLocaleDateString(),
        parties: body.parties,
        description: body.description,
        location: body.location,
        district: body.district || null,
        sector: body.sector || null,
        cell: body.cell || null,
        village: body.village || null,
        assignedAbunziId: assignedAbunziId,
      } as any,
    });
    return NextResponse.json(dispute);
  } catch (error) {
    console.error("POST dispute error:", error);
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 });
  }
}
