import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";

export default async function InsightsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");
  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  const response = await fetch("http://localhost:3000/api/admin/insights", {
    headers: {
      cookie: `session=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return <main className="mx-auto max-w-5xl px-4 py-10">Unable to load insights.</main>;
  }

  const data = await response.json();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-[28px] border border-blue-100 bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Analytics</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Insights</h1>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Posts" value={String(data.totalPosts ?? 0)} />
          <StatCard label="Comments" value={String(data.totalComments ?? 0)} />
          <StatCard label="Pending" value={String(data.pendingCount ?? 0)} highlight />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel title="Most viewed">
            <ul className="space-y-3">
              {(data.topViewed ?? []).map((item: { id: string; title: string; viewCount: number }, index: number) => (
                <li key={item.id} className="flex items-center justify-between border-b border-slate-200 pb-2 text-sm text-slate-700">
                  <span>{index + 1}. {item.title}</span>
                  <span className="font-medium text-slate-900">{item.viewCount}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Most commented">
            <ul className="space-y-3">
              {(data.topCommented ?? []).map((item: { _id: string; total: number }, index: number) => (
                <li key={String(item._id)} className="flex items-center justify-between border-b border-slate-200 pb-2 text-sm text-slate-700">
                  <span>{index + 1}. {String(item._id)}</span>
                  <span className="font-medium text-slate-900">{item.total}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  const classes = highlight ? "rounded-[22px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm" : "rounded-[22px] border border-blue-100 bg-white p-5 shadow-sm";
  return (
    <div className={classes}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
