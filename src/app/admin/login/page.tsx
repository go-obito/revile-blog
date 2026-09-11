import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { verifySessionToken } from "@/lib/auth";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session) redirect("/admin");
  }

  await dbConnect();
  const hasAdmin = (await AdminUser.countDocuments()) > 0;
  if (!hasAdmin) redirect("/admin/signup");

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">Sign in</h1>
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Email
            <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 outline-none ring-0 focus:border-stone-500" />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Password
            <input name="password" type="password" required className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 outline-none ring-0 focus:border-stone-500" />
          </label>
          <button type="submit" className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">Continue</button>
        </form>
      </div>
    </main>
  );
}
