import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const action = String(form.get("action") ?? "");

  if (!id) {
    return NextResponse.json({ error: "Missing comment id" }, { status: 400 });
  }

  await dbConnect();
  if (action === "approve") {
    await Comment.findByIdAndUpdate(id, { status: "approved" });
    return NextResponse.redirect(new URL("/admin/comments", request.url));
  }

  await Comment.findByIdAndDelete(id);
  return NextResponse.redirect(new URL("/admin/comments", request.url));
}
