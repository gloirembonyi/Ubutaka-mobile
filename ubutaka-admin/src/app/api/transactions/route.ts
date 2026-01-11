import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        title: body.title,
        upi: body.upi,
        status: body.status,
        date: body.date,
        step: body.step,
        progress: body.progress,
      },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("POST transaction error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
