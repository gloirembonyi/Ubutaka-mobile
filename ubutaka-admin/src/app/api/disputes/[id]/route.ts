import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const dispute = await prisma.dispute.update({
      where: { id },
      data: {
        status: body.status || undefined,
        description: body.description || undefined,
        parties: body.parties || undefined,
        location: body.location || undefined,
      },
    });

    return NextResponse.json(dispute);
  } catch (error: any) {
    console.error("PATCH dispute error:", error);
    return NextResponse.json({ error: "Failed to update dispute", details: error.message }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dispute = await prisma.dispute.findUnique({
      where: { id },
    });

    if (!dispute) {
       return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    return NextResponse.json(dispute);
  } catch (error) {
    console.error("GET dispute error:", error);
    return NextResponse.json({ error: "Failed to fetch dispute" }, { status: 500 });
  }
}
