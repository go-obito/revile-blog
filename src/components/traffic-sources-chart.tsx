"use client";

import { formatCompactNumber } from "@/components/formater";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ShareBarList,
	ShareBarListContent,
	ShareBarListFill,
	ShareBarListItem,
	ShareBarListLabel,
	ShareBarListValue,
} from "@/components/share-bar-list";

function barWidthPercent(maxSessions: number, sessions: number) {
	if (maxSessions <= 0) return 0;
	return (sessions / maxSessions) * 75;
}

export function TrafficSourcesChart({ rows: chartRows }: { rows?: Array<{ source: string; sessions: number }> }) {
	const data = chartRows ?? [];
	const maxSessions = Math.max(...data.map((entry) => entry.sessions), 0);

	return (
		<Card className="dark:bg-transparent">
			<CardHeader className="border-b">
				<CardTitle className="text-balance">Sessions by source</CardTitle>
				<CardDescription className="text-pretty">Attributed sessions in the last 12 months.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 py-1">
				{data.length ? (
					<ShareBarList aria-label="Sessions by traffic source">
						{data.map((row) => (
							<ShareBarListItem key={row.source} value={barWidthPercent(maxSessions, row.sessions)}>
								<ShareBarListContent>
									<ShareBarListLabel>{row.source}</ShareBarListLabel>
									<ShareBarListValue>{formatCompactNumber(row.sessions)}</ShareBarListValue>
								</ShareBarListContent>
								<ShareBarListFill />
							</ShareBarListItem>
						))}
					</ShareBarList>
				) : (
					<div className="flex min-h-[160px] items-center justify-center px-6 text-sm text-muted-foreground">No source data available yet.</div>
				)}
			</CardContent>
		</Card>
	);
}
