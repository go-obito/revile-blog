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

export function BrowserShare({ rows: browserRows }: { rows?: Array<{ label: string; share: number }> }) {
	const data = browserRows ?? [];

	return (
		<Card className="dark:bg-transparent">
			<CardHeader className="border-b">
				<CardTitle className="text-balance">Browsers</CardTitle>
				<CardDescription className="text-pretty">Share of sessions by primary browser family.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 py-1">
				{data.length ? (
					<ShareBarList aria-label="Sessions by browser">
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
					<div className="flex min-h-[160px] items-center justify-center px-6 text-sm text-muted-foreground">No browser data available yet.</div>
				)}
			</CardContent>
		</Card>
	);
}
