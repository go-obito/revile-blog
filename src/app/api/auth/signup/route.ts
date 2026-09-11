import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(new URL(`/admin/signup?error=${encodeURIComponent("Email and password are required.")}`, request.url));
  }

  await dbConnect();

  const adminCount = await AdminUser.countDocuments();
  if (adminCount > 0) {
    return NextResponse.json({ error: "An admin account already exists." }, { status: 403 });
  }

  if (password.length < 8) {
    return NextResponse.redirect(new URL(`/admin/signup?error=${encodeURIComponent("Password must be at least 8 characters long.")}`, request.url));
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await AdminUser.create({ email, passwordHash });

  const token = await createSessionToken({ sub: user._id.toString(), email: user.email });
  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/admin", request.url));
}
