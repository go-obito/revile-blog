import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

export async function GET() {
  await dbConnect();
  const count = await AdminUser.countDocuments();
  return NextResponse.json({ adminExists: count > 0 });
}
