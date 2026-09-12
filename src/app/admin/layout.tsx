import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const session = token ? await verifySessionToken(token) : null;

	// Login / signup render without the dashboard shell.
	if (!session) {
		return children;
	}

	return <AppShell userEmail={session.email}>{children}</AppShell>;
}
