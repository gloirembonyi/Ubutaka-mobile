
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const document = await prisma.landDocument.update({
      where: { id },
      data: {
        status: body.status,
        isCertified: body.isCertified,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("PATCH document error:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
