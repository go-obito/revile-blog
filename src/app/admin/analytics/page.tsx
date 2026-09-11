import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { verifySessionToken } from "@/lib/auth";

const PERIODS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "180d", label: "180 days" },
  { value: "365d", label: "1 year" },
  { value: "all", label: "All time" },
];

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");

  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/analytics/overview`, {
    headers: { cookie: `session=${token}` },
    cache: "no-store",
  });

  const data = response.ok ? await response.json() : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Insights</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Analytics overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Refresh</button>
          <select defaultValue="30d" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none">
            {PERIODS.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!data ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-slate-600">Unable to load analytics right now.</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Page views" value={String(data.summary?.totalViews ?? 0)} delta={data.metrics?.viewsDelta ?? 0} />
            <MetricCard label="Unique visitors" value={String(data.summary?.uniqueVisitors ?? 0)} delta={data.metrics?.visitorsDelta ?? 0} />
            <MetricCard label="Posts" value={String(data.summary?.totalPosts ?? 0)} delta={data.metrics?.postsDelta ?? 0} />
            <MetricCard label="Comments" value={String(data.summary?.totalComments ?? 0)} delta={data.metrics?.commentsDelta ?? 0} />
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Page views</h2>
              </div>
              <div className="text-right text-sm text-slate-600">
                <div className="font-medium text-slate-900">{data.summary?.totalViews ?? 0}</div>
                <div className="text-slate-500">Total this period</div>
              </div>
            </div>
            <AnalyticsChart data={data.chart ?? []} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Top posts</h3>
              <div className="mt-4 space-y-3">
                {(data.topPosts ?? []).map((post: { title: string; views: number }, index: number) => (
                  <div key={`${post.title}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">#{index + 1}</p>
                      <p className="mt-1 font-medium text-slate-900">{post.title}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{post.views} views</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Traffic sources</h3>
              <div className="mt-4 space-y-3">
                {(data.sources ?? []).map((source: { source: string; visits: number }, index: number) => (
                  <div key={`${source.source}-${index}`} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-slate-700">{source.source}</span>
                    <span className="text-sm font-medium text-slate-900">{source.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value, delta }: { label: string; value: string; delta: number }) {
  const positive = delta >= 0;
  const sign = positive ? "+" : "";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className={`mt-2 text-sm font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
        {sign}{delta.toFixed(1)}% vs previous period
      </p>
    </div>
  );
}
