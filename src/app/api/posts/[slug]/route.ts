import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { serializePost } from "@/lib/serialize";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await dbConnect();

  const post = await Post.findOne({ slug, status: "published" }).lean();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

  return NextResponse.json({ post: serializePost(post as Parameters<typeof serializePost>[0]) });
}
