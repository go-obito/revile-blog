import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminDashboard() {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	if (!token) redirect("/admin/login");

	const session = await verifySessionToken(token);
	if (!session) redirect("/admin/login");

	return <Dashboard />;
}
