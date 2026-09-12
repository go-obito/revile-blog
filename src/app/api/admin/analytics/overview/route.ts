import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { getAnalyticsOverview } from "@/lib/analytics";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as "7d" | "30d" | "90d" | "180d" | "365d" | "all") || "30d";
    const validRanges = ["7d", "30d", "90d", "180d", "365d", "all"];

    if (!validRanges.includes(range)) {
      return NextResponse.json({ error: "Invalid range" }, { status: 400 });
    }

    await dbConnect();
    const [analytics, posts, comments] = await Promise.all([
      getAnalyticsOverview(range),
      Post.find().sort({ updatedAt: -1 }).limit(6).lean(),
      Comment.find().sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    return NextResponse.json({
      summary: analytics.summary,
      metrics: analytics.metrics,
      chart: analytics.chart,
      topPosts: analytics.topPosts,
      sources: analytics.sources,
      dashboard: analytics.dashboard,
      recentActivity: analytics.recentActivity,
      recentPosts: posts.map((post) => ({
        id: String(post._id),
        title: post.title,
        status: post.status,
        slug: post.slug,
        viewCount: post.viewCount ?? 0,
        coverImageUrl: post.coverImageUrl ?? "",
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
      })),
      recentComments: comments.map((comment) => ({
        id: String(comment._id),
        postId: String(comment.postId),
        authorName: comment.authorName,
        status: comment.status,
        body: comment.body,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin analytics overview error", error);
    return NextResponse.json({ error: "Unable to load analytics." }, { status: 500 });
  }
}
