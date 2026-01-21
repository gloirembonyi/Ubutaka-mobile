"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function verifyParcel(upi: string) {
  try {
    const certificateId = `RT-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    
    await prisma.parcel.update({
      where: { upi },
      data: {
        status: "Verified",
        isVerified: true,
        verifiedAt: new Date(),
        certificateId: certificateId,
      },
    });

    revalidatePath("/admin/parcels");
    revalidatePath(`/admin/parcels/${upi}`);
    
    return { success: true, certificateId };
  } catch (error: any) {
    console.error("Verification error:", error);
    return { success: false, error: error.message };
  }
}
