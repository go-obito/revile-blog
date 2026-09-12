"use client";

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

export function Dashboard() {
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
		<div className="mx-auto w-full max-w-[1500px]">
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
