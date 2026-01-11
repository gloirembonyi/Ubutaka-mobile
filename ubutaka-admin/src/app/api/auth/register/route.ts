import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, nationalId, role } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { nationalId: nationalId }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or national ID already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        nationalId,
        isVerified: false,
        role: role || "USER",
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}`,
      },
    });

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

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("POST register error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
