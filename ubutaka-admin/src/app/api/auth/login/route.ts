import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Don't send password back in response
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      nationalId: user.nationalId,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    };

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("POST login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
