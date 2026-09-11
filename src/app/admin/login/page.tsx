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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%),linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] p-6">
      <div className="w-full max-w-md rounded-[28px] border border-blue-100 bg-white p-8 shadow-[0_25px_60px_rgba(30,64,175,0.12)]">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
        </div>
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input name="password" type="password" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
          </label>
          <button type="submit" className="primary-button nav-cta w-full rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">Continue</button>
        </form>
      </div>
    </main>
  );
}
