"use client";

import { cn } from "@/lib/utils";
import { formatInteger } from "@/components/formater";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { StatusIndicator } from "@/components/indicator";
import {
	ShareBarList,
	ShareBarListContent,
	ShareBarListFill,
	ShareBarListItem,
	ShareBarListLabel,
	ShareBarListValue,
} from "@/components/share-bar-list";

type DeviceMixRow = { label: string; share: number };

export function OnlineNow({ value, delta, rows }: { value?: number; delta?: number; rows?: DeviceMixRow[] }) {
	const activeVisitors = Number(value ?? 0);
	const trendDelta = Number(delta ?? 0);
	const devices = rows ?? [];

	return (
		<Card className="gap-0 pb-0 md:col-span-2 lg:col-span-1 dark:bg-transparent">
			<CardHeader className="flex flex-row items-start justify-between gap-3 border-b">
				<div className="flex min-w-0 flex-col gap-0">
					<CardTitle className="font-mono text-2xl tabular-nums">{formatInteger(activeVisitors)}</CardTitle>
					<CardDescription>
						<Tooltip>
							<TooltipTrigger render={<Button className={cn(
								"cursor-help px-1 py-px font-normal text-muted-foreground",
								"hover:underline-0"
							)} type="button" variant="link" />}><StatusIndicator /><span>visitors online</span></TooltipTrigger>
							<TooltipContent side="bottom">From the current analytics window.</TooltipContent>
						</Tooltip>
					</CardDescription>
				</div>
				<Delta value={trendDelta} variant="badge">
					<DeltaIcon variant="trend" />
					<DeltaValue suffix="%" />
				</Delta>
			</CardHeader>
			<CardContent className={cn("relative flex h-full items-center px-0 py-2")}>
				{devices.length ? (
					<ShareBarList>
						{devices.map((d) => (
							<ShareBarListItem key={d.label} value={d.share}>
								<ShareBarListContent>
									<ShareBarListLabel>{d.label}</ShareBarListLabel>
									<ShareBarListValue>{d.share}%</ShareBarListValue>
								</ShareBarListContent>
								<ShareBarListFill data-online-bar />
							</ShareBarListItem>
						))}
					</ShareBarList>
				) : (
					<div className="flex h-full w-full items-center justify-center px-4 text-sm text-muted-foreground">
						No device data available yet.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
