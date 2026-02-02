import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isVerified: body.isVerified !== undefined ? body.isVerified : undefined,
        name: body.name || undefined,
        nationalId: body.nationalId || undefined,
        avatar: body.avatar || undefined,
        // Profile completion fields
        idPictureUrl: body.idPictureUrl !== undefined ? body.idPictureUrl : undefined,
        biometricRegistered: body.biometricRegistered !== undefined ? body.biometricRegistered : undefined,
        digitalSignature: body.digitalSignature !== undefined ? body.digitalSignature : undefined,
        profileCompleted: body.profileCompleted !== undefined ? body.profileCompleted : undefined,
      } as any,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET user error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
