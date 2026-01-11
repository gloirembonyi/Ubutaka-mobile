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
    const dispute = await prisma.dispute.create({
      data: {
        upi: body.upi,
        type: body.type,
        status: body.status,
        dateOpened: body.dateOpened,
        parties: body.parties,
        description: body.description,
        location: body.location,
      },
    });
    return NextResponse.json(dispute);
  } catch (error) {
    console.error("POST dispute error:", error);
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 });
  }
}
