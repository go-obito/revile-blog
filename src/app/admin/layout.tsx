import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifySessionToken(token);
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell userEmail={session.email}>{children}</AdminShell>;
}
