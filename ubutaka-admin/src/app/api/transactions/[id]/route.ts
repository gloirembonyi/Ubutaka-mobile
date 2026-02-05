
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: body.status,
        step: body.step,
        progress: body.progress,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("PATCH transaction error:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
