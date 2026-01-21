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

    // Blockchain Simulation: Fetch last block to chain it
    const lastTx = await prisma.transaction.findFirst({
      where: { upi: body.upi },
      orderBy: { createdAt: 'desc' }
    });

    const previousHash = lastTx?.txHash || "0x0000000000000000000000000000000000000000000000000000000000000000";
    const blockNumber = (lastTx?.blockNumber || 0) + 1;
    
    // Simulate mining/hashing
    const timestamp = new Date().toISOString();
    const dataString = `${previousHash}${body.upi}${body.sellerName}${body.buyerName}${body.price}${timestamp}`;
    
    // Simple hash simulation for demo (in production use real crypto)
    const randomNonce = Math.random().toString(36).substring(7);
    const txHash = `0x${Math.abs(dataString.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16)}${randomNonce}`;

    const transaction = await prisma.transaction.create({
      data: {
        title: body.title,
        upi: body.upi,
        type: body.type || "TRANSFER",
        status: body.status || "PENDING_NOTARY",
        date: body.date || new Date().toISOString(),
        step: body.step || "Initiated",
        progress: body.progress || 10,
        
        sellerName: body.sellerName,
        buyerName: body.buyerName,
        price: body.price ? String(body.price) : null,
        
        txHash: txHash,
        blockNumber: blockNumber,
        previousHash: previousHash,
        gasFee: "0.00045 ETH", // Simulated fee
      } as any,
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("POST transaction error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
