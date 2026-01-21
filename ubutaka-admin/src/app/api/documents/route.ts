
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId");
  const upi = searchParams.get("upi");

  try {
    const documents = await prisma.landDocument.findMany({
      where: {
        ...(ownerId ? { ownerId } : {}),
        ...(upi ? { upi } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const document = await prisma.landDocument.create({
      data: {
        name: body.name,
        category: body.category,
        url: body.url,
        upi: body.upi,
        ownerId: body.ownerId,
        fileDate: body.fileDate,
        description: body.description,
        isEncrypted: body.isEncrypted !== undefined ? body.isEncrypted : true,
      },
    });
    return NextResponse.json(document);
  } catch (error: any) {
    console.error("POST document error:", error);
    return NextResponse.json({ error: "Failed to upload document", details: error.message }, { status: 500 });
  }
}
