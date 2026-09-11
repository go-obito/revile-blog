import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const redirectTo = String(form.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent("Email and password are required.")}`, request.url));
  }

  await dbConnect();
  const user = await AdminUser.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent("Invalid email or password")}`, request.url));
  }

  const token = await createSessionToken({ sub: user._id.toString(), email: user.email });
  await setSessionCookie(token);

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
