import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { Post } from "@/lib/models/Post";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const topViewed = await Post.find({ status: "published" }).sort({ viewCount: -1 }).limit(5).lean();
  const topCommented = await Comment.aggregate([
    { $group: { _id: "$postId", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  const pendingCount = await Comment.countDocuments({ status: "pending" });
  const totalComments = await Comment.countDocuments();
  const totalPosts = await Post.countDocuments();

  const activity = await Comment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 },
  ]);

  return NextResponse.json({
    totalPosts,
    totalComments,
    pendingCount,
    topViewed: topViewed.map((post) => ({
      id: String(post._id),
      title: post.title,
      viewCount: post.viewCount,
    })),
    topCommented,
    activity,
  });
}
