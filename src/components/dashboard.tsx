"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AudienceMix } from "@/components/audience-mix";
import { BrowserShare } from "@/components/browser-share";
import { OnlineNow } from "@/components/online-now";
import { TopCountries } from "@/components/top-countries";
import { TopPages } from "@/components/top-pages";
import { TopReferrers } from "@/components/top-referrers";
import { TrafficSourcesChart } from "@/components/traffic-sources-chart";
import { VisitorsChart } from "@/components/visitors-chart";
import { WebVitals } from "@/components/web-vitals";

type DashboardPayload = {
	summary?: {
		totalViews?: number;
		uniqueVisitors?: number;
		totalPosts?: number;
		totalComments?: number;
		pendingComments?: number;
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
	dashboard?: {
		topPages?: Array<{ path: string; visits: number; delta: number }>;
		topCountries?: Array<{ code: string; visits: number; delta: number }>;
		audienceMix?: Array<{ label: string; share: number }>;
		sources?: Array<{ source: string; sessions: number }>;
		browsers?: Array<{ label: string; share: number }>;
		topReferrers?: Array<{ host: string; sessions: number }>;
		webVitals?: Array<{ label: string; name: string; value: string; delta: number; deltaLabel: string; suffix: string }>;
	};
};

type DraftSummary = {
	_id: string;
	title: string;
	slug: string;
	status: string;
	updatedAt: string | null;
};

export function Dashboard({ recentDrafts = [] }: { recentDrafts?: DraftSummary[] }) {
	const [data, setData] = useState<DashboardPayload | null>(null);

	useEffect(() => {
		let mounted = true;

		fetch("/api/admin/analytics/overview?range=30d", { cache: "no-store" })
			.then((response) => response.json())
			.then((payload: DashboardPayload) => {
				if (mounted) setData(payload);
			})
			.catch(() => undefined);

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="mx-auto w-full max-w-[1500px] space-y-6">
			<div className="rounded-[28px] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white p-5 shadow-sm">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Draft workspace</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-900">Resume or publish your next story</h2>
					</div>
					<Link href="/admin/posts" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
						View all posts
					</Link>
				</div>

				<div className="mt-5 space-y-3">
					{recentDrafts.length === 0 ? (
						<p className="text-sm text-slate-600">No drafts yet. Save a story as draft to see it here.</p>
					) : (
						recentDrafts.map((draft) => (
							<div key={draft._id} className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-sm font-semibold text-slate-900">{draft.title}</p>
									<p className="mt-1 text-xs text-slate-500">
										{draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently updated"}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Link href={`/admin/posts/${draft._id}/edit`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">
										Resume draft
									</Link>
									<Link href={`/admin/posts/${draft._id}/edit`} className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500">
										Publish
									</Link>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
				<div className="xl:col-span-5"> <VisitorsChart rows={data?.chart} totalVisitors={data?.summary?.uniqueVisitors} deltaValue={data?.metrics?.visitorsDelta} /> </div>
				<div className="xl:col-span-3"> <OnlineNow value={data?.summary?.uniqueVisitors} delta={data?.metrics?.visitorsDelta} rows={data?.dashboard?.audienceMix} /> </div>
				<div className="xl:col-span-4"> <TopPages rows={data?.dashboard?.topPages} /> </div>
				<div className="xl:col-span-4"> <TopCountries rows={data?.dashboard?.topCountries} /> </div>
				<div className="xl:col-span-5"> <TrafficSourcesChart rows={data?.dashboard?.sources} /> </div>
				<div className="xl:col-span-3"> <AudienceMix rows={data?.dashboard?.audienceMix} /> </div>
				<div className="xl:col-span-4"> <BrowserShare rows={data?.dashboard?.browsers} /> </div>
				<div className="xl:col-span-5"> <TopReferrers rows={data?.dashboard?.topReferrers} /> </div>
				<div className="xl:col-span-7"> <WebVitals vitals={data?.dashboard?.webVitals} /> </div>
			</div>
		</div>
	);
}
