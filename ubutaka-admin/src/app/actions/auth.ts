"use server";

import prisma from "@/lib/db";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt for:", email);
  console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
        role: "ADMIN",
      } as object,
    });

    if (user) {
      return { success: true };
    } else {
      return { success: false, error: "Invalid credentials or not an admin" };
    }
  } catch (error) {
    console.error("Database error during login:", error);
    throw error;
  }
}
