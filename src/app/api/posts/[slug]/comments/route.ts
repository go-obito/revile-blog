import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { sanitizePlainText } from "@/lib/sanitize";
import { clientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const session = await getSession();
  const status = url.searchParams.get("status") || "approved";

  if (status === "pending" && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await Comment.find({ postId: post._id, status: status === "pending" ? "pending" : "approved" }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const form = await request.formData();
  const authorName = sanitizePlainText(String(form.get("authorName") ?? ""), 80);
  const authorEmail = sanitizePlainText(String(form.get("authorEmail") ?? ""), 200).toLowerCase();
  const body = sanitizePlainText(String(form.get("body") ?? ""), 2000);
  const redirectTo = String(form.get("redirectTo") ?? "/");

  if (!authorName || !authorEmail || !body) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=${encodeURIComponent("Please complete all comment fields.")}`, request.url));
  }

  const allowed = /.+@.+\..+/;
  if (!allowed.test(authorEmail)) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=${encodeURIComponent("Please provide a valid email address.")}`, request.url));
  }

  await dbConnect();
  const post = await Post.findOne({ slug });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const ip = clientIp(request.headers);
  if (!rateLimit(`comment:${ip}`, 5, 60 * 1000)) {
    return NextResponse.json({ error: "Too many comments. Please wait a moment." }, { status: 429 });
  }

  await Comment.create({
    postId: post._id,
    authorName,
    authorEmail,
    body,
    status: "pending",
  });

  return NextResponse.redirect(new URL(`${redirectTo}?success=${encodeURIComponent("Thanks — your comment is pending approval.")}`, request.url));
}
