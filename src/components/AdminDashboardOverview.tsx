"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

type DashboardResponse = {
  summary?: {
    totalViews?: number;
    uniqueVisitors?: number;
    totalPosts?: number;
    totalComments?: number;
    engagementRate?: number;
    engagementDelta?: number;
  };
  metrics?: {
    viewsDelta?: number;
    viewsPrevious?: number;
    visitorsDelta?: number;
    visitorsPrevious?: number;
    engagementRateDelta?: number;
  };
  chart?: Array<{ date: string; views: number }>;
  topPosts?: Array<{ title: string; views: number }>; 
  recentPosts?: Array<{ title: string; coverImageUrl?: string; publishedAt?: string | null; viewCount?: number }>;
  recentComments?: Array<{ id: string; authorName?: string; body?: string; createdAt?: string; postId?: string }>;
  error?: string;
};

const rangeOptions = [
  { value: "7d", label: "Daily" },
  { value: "30d", label: "Weekly" },
  { value: "90d", label: "Monthly" },
];

export function AdminDashboardOverview({
  siteName,
}: {
  siteName?: string;
}) {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/analytics/overview?range=${range}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load analytics data.");
      }

      const payload = (await response.json()) as DashboardResponse;
      if (payload.error) {
        throw new Error(payload.error);
      }
      setData(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const currentMonthLabel = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date()), []);

  const engagementValue = Number(data?.summary?.engagementRate ?? 0);
  const engagementDelta = Number(data?.summary?.engagementDelta ?? data?.metrics?.engagementRateDelta ?? 0);
  const totalViews = Number(data?.summary?.totalViews ?? 0);
  const viewsDelta = Number(data?.metrics?.viewsDelta ?? 0);
  const viewsPrevious = Number(data?.metrics?.viewsPrevious ?? 0);
  const uniqueVisitors = Number(data?.summary?.uniqueVisitors ?? 0);
  const visitorsDelta = Number(data?.metrics?.visitorsDelta ?? 0);
  const visitorsPrevious = Number(data?.metrics?.visitorsPrevious ?? 0);

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Good Morning {siteName || "Revile"}!</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Previous range">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                {rangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Next range">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : null}

        {loading && !data ? (
          <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[1.8fr_0.8fr]">
              <SkeletonCard className="h-[380px]" />
              <div className="space-y-5">
                <SkeletonCard className="h-[180px]" />
                <SkeletonCard className="h-[180px]" />
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              <SkeletonCard className="h-[240px]" />
              <SkeletonCard className="h-[240px]" />
              <SkeletonCard className="h-[240px]" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-[1.8fr_0.8fr]">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[18px] font-medium text-slate-900">Engagement Rate</h3>
                  <span className="text-sm font-medium text-slate-500">{currentMonthLabel}</span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <div className="text-[2.8rem] font-bold tracking-tight text-slate-900">{engagementValue.toFixed(1)}%</div>
                  <div
                    className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      engagementDelta >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {engagementDelta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {Math.abs(engagementDelta).toFixed(1)}%
                  </div>
                </div>

                {data?.chart && data.chart.length > 0 ? (
                  <div className="mt-5 h-[280px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <defs>
                          <linearGradient id="engagementFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} minTickGap={20} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, "dataMax + 10"]} />
                        <Tooltip
                          cursor={{ stroke: "#93c5fd", strokeDasharray: "5 5" }}
                          contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}
                          formatter={(value) => [`${value ?? 0}`, "Views"]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fill="url(#engagementFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="mt-5 flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                    No traffic data available for this period.
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <StatCard
                  title="Total Views"
                  value={formatCompactNumber(totalViews)}
                  delta={viewsDelta}
                  previousValue={viewsPrevious}
                  subtitle={`From ${formatCompactNumber(viewsPrevious)}`}
                />
                <StatCard
                  title="Unique Visitors"
                  value={formatCompactNumber(uniqueVisitors)}
                  delta={visitorsDelta}
                  previousValue={visitorsPrevious}
                  subtitle={`From ${formatCompactNumber(visitorsPrevious)}`}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <ScheduleCard post={data?.recentPosts?.[0] ?? null} />
              <TopArticlesCard posts={data?.topPosts?.map((post) => ({ title: post.title, viewCount: post.views })) ?? []} />
              <LatestResponseCard comments={data?.recentComments ?? []} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  delta,
  previousValue,
  subtitle,
}: {
  title: string;
  value: string;
  delta: number;
  previousValue: number;
  subtitle: string;
}) {
  const positive = delta >= 0;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[18px] font-medium text-slate-800">{title}</span>
        <button type="button" className="text-sm font-medium text-slate-500">View Detail</button>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="text-[2.1rem] font-bold tracking-tight text-slate-900">{value}</div>
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta).toFixed(1)}%
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-500">{subtitle}</div>
      <p className="mt-2 text-xs text-slate-400">Previous: {formatCompactNumber(previousValue)}</p>
    </div>
  );
}

function ScheduleCard({ post }: { post: { title?: string; publishedAt?: string | null; coverImageUrl?: string } | null }) {
  const title = post?.title || "No upcoming article";
  const image = post?.coverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";
  const date = post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-medium text-slate-900">Next Article Schedule</h3>
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">3 Issues</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">
        <img src={image} alt={title} className="h-32 w-full object-cover" />
      </div>

      <div className="mt-4">
        <p className="text-[1.1rem] font-semibold text-slate-900">{title}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          {date}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/admin/posts" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
          View All
        </Link>
      </div>
    </div>
  );
}

function TopArticlesCard({ posts }: { posts: Array<{ title: string; viewCount?: number; publishedAt?: string | Date | null; coverImageUrl?: string }> }) {
  const list = posts.length ? posts : [];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-[18px] font-medium text-slate-900">Your Top Articles</h3>

      <div className="mt-4 space-y-4">
        {list.length ? (
          list.map((post, index) => (
            <div key={`${post.title}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
              <img src={post.coverImageUrl || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80"} alt={post.title} className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{post.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"} · {Math.max(2, Math.round((post.viewCount ?? 0) / 250))} min read
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">No articles available yet.</div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link href="/admin/posts" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
          View All
        </Link>
      </div>
    </div>
  );
}

function LatestResponseCard({ comments }: { comments: Array<{ authorName?: string; body?: string; createdAt?: string | Date | null }> }) {
  const list = comments.length ? comments : [];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-[18px] font-medium text-slate-900">Latest Response</h3>

      <div className="mt-4 space-y-4">
        {list.length ? (
          list.map((comment, index) => (
            <div key={`${comment.authorName ?? "comment"}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{comment.body || "Comment body unavailable"}</p>
              <div className="mt-2 text-xs text-slate-500">Article: <span className="font-medium text-slate-700">{comment.authorName ? "Published article" : "Recent post"}</span></div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">{comment.authorName || "Anonymous"}</span>
                <span>{comment.createdAt ? formatTimeAgo(new Date(comment.createdAt)) : "just now"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">No recent responses yet.</div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link href="/admin/comments" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
          View All
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-[24px] border border-slate-200 bg-slate-200/80 ${className ?? ""}`} />;
}

function formatCompactNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2).replace(/\.00$/, "")}k`;
  }
  return value.toLocaleString();
}

function formatTimeAgo(date: Date) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
