import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { verifySessionToken } from "@/lib/auth";
import { AdminDashboardOverview } from "@/components/AdminDashboardOverview";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");

  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  await dbConnect();

  const [posts, comments] = await Promise.all([
    Post.find().sort({ updatedAt: -1 }).lean(),
    Comment.find().sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  const publishedPosts = posts.filter((post) => post.status === "published");
  const latestPost = publishedPosts[0] ?? posts[0] ?? null;
  const topPosts = [...publishedPosts].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, 2);
  const recentComments = comments.filter((comment) => comment.status === "approved").slice(0, 2);

  const adminName = session.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return <AdminDashboardOverview siteName={session.email.split("@")[0]} />;
}
