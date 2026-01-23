import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ubutaka-secret-key-change-this-in-prod";
 
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, biometricToken } = body;

    let user;

    if (biometricToken) {
      // Login via Biometric Token (JWT)
      try {
        const decoded: any = jwt.verify(biometricToken, JWT_SECRET);
        user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid or expired biometric session" },
          { status: 401 }
        );
      }
    } else {
      // Login via Password
      if (!email || !password) {
        return NextResponse.json(
            { error: "Please provide email and password" },
            { status: 400 }
          );
      }

      user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
    }

    // Generate NEW JWT token (refresh session)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      nationalId: user.nationalId,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    };

    return NextResponse.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("POST login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
