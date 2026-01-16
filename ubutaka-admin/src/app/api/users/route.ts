import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Failed to fetch users", details: error.message }, { status: 500 });
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password || !body.name || !body.nationalId) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, name, nationalId" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        nationalId: body.nationalId,
        isVerified: body.isVerified || false,
        avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(body.name)}`,
        role: body.role || "USER",
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
