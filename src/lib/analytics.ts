import { headers } from "next/headers";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { AnalyticsEvent, type AnalyticsEventType } from "@/lib/models/AnalyticsEvent";

export type AnalyticsRange = "7d" | "30d" | "90d" | "180d" | "365d" | "all";

export function getRangeWindow(range: AnalyticsRange = "30d") {
  const now = new Date();
  const start = new Date(now);

  switch (range) {
    case "7d":
      start.setDate(now.getDate() - 6);
      break;
    case "30d":
      start.setDate(now.getDate() - 29);
      break;
    case "90d":
      start.setDate(now.getDate() - 89);
      break;
    case "180d":
      start.setDate(now.getDate() - 179);
      break;
    case "365d":
      start.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
      start.setFullYear(2020);
      break;
    default:
      start.setDate(now.getDate() - 29);
  }

  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function previousWindow(range: AnalyticsRange = "30d") {
  const current = getRangeWindow(range);
  const days = (() => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      case "180d": return 180;
      case "365d": return 365;
      default: return 30;
    }
  })();

  const previousEnd = new Date(current.start);
  previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

  const previousStart = new Date(current.start);
  previousStart.setDate(previousStart.getDate() - days);

  return { start: previousStart, end: previousEnd };
}

export function formatDelta(current: number, previous: number) {
  const diff = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
  return Number.isFinite(diff) ? diff : 0;
}

export async function getAnalyticsOverview(range: AnalyticsRange = "30d") {
  await dbConnect();

  const currentWindow = getRangeWindow(range);
  const previousWindowRange = previousWindow(range);

  const currentFilter = { type: "page_view", createdAt: { $gte: currentWindow.start, $lte: currentWindow.end } };
  const previousFilter = { type: "page_view", createdAt: { $gte: previousWindowRange.start, $lte: previousWindowRange.end } };

  const [currentViews, previousViews, uniqueCurrent, uniquePrevious, topPosts, sources, recentActivity, totalPosts, pendingComments, totalComments] = await Promise.all([
    AnalyticsEvent.countDocuments(currentFilter),
    AnalyticsEvent.countDocuments(previousFilter),
    AnalyticsEvent.distinct("visitorId", { ...currentFilter, visitorId: { $ne: null } }).then((values) => values.length),
    AnalyticsEvent.distinct("visitorId", { ...previousFilter, visitorId: { $ne: null } }).then((values) => values.length),
    AnalyticsEvent.aggregate([
      { $match: { type: "page_view", postId: { $ne: null }, createdAt: { $gte: currentWindow.start, $lte: currentWindow.end } } },
      { $group: { _id: "$postId", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: "posts", localField: "_id", foreignField: "_id", as: "post" } },
      { $unwind: "$post" },
      { $project: { _id: 0, postId: "$post._id", title: "$post.title", views: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: "page_view", createdAt: { $gte: currentWindow.start, $lte: currentWindow.end } } },
      { $project: { referrer: 1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: { $ifNull: ["$referrer", ""] }, regex: /^https?:\/\//i } },
              { $arrayElemAt: [{ $split: [{ $replaceAll: { input: { $ifNull: ["$referrer", ""] }, find: "https://", replacement: "" } }, "/"] }, 0] },
              { $literal: "direct" },
            ]
          },
          visits: { $sum: 1 },
        },
      },
      { $sort: { visits: -1 } },
      { $limit: 6 },
    ]),
    AnalyticsEvent.find({ createdAt: { $gte: currentWindow.start, $lte: currentWindow.end } })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Post.countDocuments(),
    Comment.countDocuments({ status: "pending" }),
    Comment.countDocuments(),
  ]);

  const currentSeries = await AnalyticsEvent.aggregate([
    { $match: { type: "page_view", createdAt: { $gte: currentWindow.start, $lte: currentWindow.end } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        views: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const previousSeries = await AnalyticsEvent.aggregate([
    { $match: { type: "page_view", createdAt: { $gte: previousWindowRange.start, $lte: previousWindowRange.end } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        views: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const seriesMap = new Map(
    currentSeries.map((item) => [
      `${String(item._id.year)}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      item.views,
    ]),
  );

  const previousSeriesMap = new Map(
    previousSeries.map((item) => [
      `${String(item._id.year)}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      item.views,
    ]),
  );

  const points: Array<{ date: string; views: number }> = [];
  const previousPoints: Array<{ date: string; views: number }> = [];
  const cursor = new Date(currentWindow.start);
  const previousCursor = new Date(previousWindowRange.start);

  while (cursor <= currentWindow.end) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    points.push({ date: key, views: seriesMap.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  while (previousCursor <= previousWindowRange.end) {
    const key = `${previousCursor.getFullYear()}-${String(previousCursor.getMonth() + 1).padStart(2, "0")}-${String(previousCursor.getDate()).padStart(2, "0")}`;
    previousPoints.push({ date: key, views: previousSeriesMap.get(key) ?? 0 });
    previousCursor.setDate(previousCursor.getDate() + 1);
  }

  const currentAverage = points.length ? points.reduce((sum, point) => sum + point.views, 0) / points.length : 0;
  const previousAverage = previousPoints.length ? previousPoints.reduce((sum, point) => sum + point.views, 0) / previousPoints.length : 0;
  const engagementRate = Number(currentAverage.toFixed(1));
  const previousEngagementRate = Number(previousAverage.toFixed(1));
  const engagementDelta = Number((((engagementRate - previousEngagementRate) / Math.max(previousEngagementRate, 1)) * 100).toFixed(1));

  return {
    summary: {
      totalViews: currentViews,
      uniqueVisitors: uniqueCurrent,
      totalPosts: totalPosts,
      totalComments: totalComments,
      pendingComments: pendingComments,
      engagementRate,
      engagementDelta,
    },
    metrics: {
      viewsDelta: formatDelta(currentViews, previousViews),
      viewsPrevious: previousViews,
      visitorsDelta: formatDelta(uniqueCurrent, uniquePrevious),
      visitorsPrevious: uniquePrevious,
      postsDelta: 0,
      commentsDelta: 0,
      pendingDelta: 0,
      engagementRateDelta: engagementDelta,
    },
    chart: points,
    topPosts,
    sources: sources.map((item) => ({ source: item._id || "direct", visits: item.visits })),
    recentActivity: recentActivity.map((event) => ({
      id: String(event._id),
      type: event.type,
      path: event.path,
      createdAt: event.createdAt,
      referrer: event.referrer,
    })),
  };
}

export async function recordAnalyticsEvent(
  input: {
    type: AnalyticsEventType;
    path: string;
    postId?: string | null;
    referrer?: string | null;
    userAgent?: string | null;
    sessionId?: string | null;
    visitorId?: string | null;
  },
) {
  await dbConnect();

  const event = new AnalyticsEvent({
    type: input.type,
    path: input.path,
    postId: input.postId ? input.postId : null,
    sessionId: input.sessionId ?? null,
    visitorId: input.visitorId ?? null,
    referrer: input.referrer ?? null,
    userAgent: input.userAgent ?? null,
    createdAt: new Date(),
  });

  await event.save();
  return event;
}

export async function trackPageViewForRequest(path: string, postId?: string | null) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const userAgent = headersList.get("user-agent") ?? undefined;
  const referrer = headersList.get("referer") ?? undefined;
  const sessionId = cookieStore.get("revile_session")?.value ?? crypto.randomUUID();
  const visitorId = cookieStore.get("revile_visitor")?.value ?? crypto.randomUUID();

  if (!cookieStore.get("revile_session")) {
    cookieStore.set("revile_session", sessionId, { path: "/", maxAge: 60 * 60 * 24 * 30, httpOnly: true, sameSite: "lax" });
  }

  if (!cookieStore.get("revile_visitor")) {
    cookieStore.set("revile_visitor", visitorId, { path: "/", maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax" });
  }

  await recordAnalyticsEvent({
    type: "page_view",
    path,
    postId: postId ?? null,
    referrer,
    userAgent,
    sessionId,
    visitorId,
  });
}

export type AnalyticsSummary = Awaited<ReturnType<typeof getAnalyticsOverview>>;
