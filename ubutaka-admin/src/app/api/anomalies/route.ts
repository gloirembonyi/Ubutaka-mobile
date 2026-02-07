
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportedById = searchParams.get('reportedById');

    const anomalies = await prisma.anomalyReport.findMany({
      where: reportedById ? { reportedById } : {},
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(anomalies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch anomalies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const anomaly = await prisma.anomalyReport.create({
      data: {
        upi: body.upi,
        type: body.type,
        description: body.description,
        imageUrl: body.imageUrl,
        location: body.location,
        latitude: body.latitude,
        longitude: body.longitude,
        reportedById: body.reportedById,
        status: body.status || 'PENDING'
      }
    });
    return NextResponse.json(anomaly);
  } catch (error: any) {
    console.error("POST anomaly error:", error);
    return NextResponse.json({ error: "Failed to create anomaly report", details: error.message }, { status: 500 });
  }
}
