import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { verifySessionToken } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";

export default async function AdminDashboard() {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	if (!token) redirect("/admin/login");

	const session = await verifySessionToken(token);
	if (!session) redirect("/admin/login");

	await dbConnect();
	const recentDrafts = await Post.find({ status: "draft" })
		.sort({ updatedAt: -1 })
		.limit(5)
		.select("title slug updatedAt status")
		.lean();

	return <Dashboard recentDrafts={recentDrafts.map((post) => ({
		_id: String(post._id),
		title: String(post.title || "Untitled draft"),
		slug: String(post.slug || ""),
		status: String(post.status || "draft"),
		updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null,
	}))} />;
}
