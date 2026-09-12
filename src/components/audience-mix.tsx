"use client";

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

export function AudienceMix({ rows: segmentRows }: { rows?: Array<{ label: string; share: number }> }) {
	const data = segmentRows ?? [];

	return (
		<Card className="dark:bg-transparent">
			<CardHeader className="border-b">
				<CardTitle className="text-balance">Audience mix</CardTitle>
				<CardDescription className="text-pretty">Session split by familiarity in the last 12 months.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 py-1">
				{data.length ? (
					<ShareBarList aria-label="Audience segments by share of sessions">
						{data.map((row) => (
							<ShareBarListItem key={row.label} value={row.share}>
								<ShareBarListContent>
									<ShareBarListLabel>{row.label}</ShareBarListLabel>
									<ShareBarListValue>{row.share}%</ShareBarListValue>
								</ShareBarListContent>
								<ShareBarListFill />
							</ShareBarListItem>
						))}
					</ShareBarList>
				) : (
					<div className="flex min-h-[160px] items-center justify-center px-6 text-sm text-muted-foreground">No audience mix data available yet.</div>
				)}
			</CardContent>
		</Card>
	);
}
