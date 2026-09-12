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
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowRightIcon } from "lucide-react";

export function TopReferrers({ rows: dataRows }: { rows?: Array<{ host: string; sessions: number }> }) {
	const rowsToRender = dataRows ?? [];

	return (
		<Card className="relative dark:bg-transparent">
			<CardHeader>
				<CardTitle className="text-balance">Top referrers</CardTitle>
				<CardDescription className="text-pretty">External sites sending the most attributed sessions.</CardDescription>
			</CardHeader>
			<CardContent className="mask-b-from-50% mask-b-to-100% p-0 pb-2">
				{rowsToRender.length ? (
					<Table className="border-t">
						<TableCaption className="sr-only">Top referrer domains by attributed sessions.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="pl-6" scope="col">Host</TableHead>
								<TableHead className="pr-6 text-end tabular-nums" scope="col">Sessions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rowsToRender.map((row) => (
								<TableRow className="hover:bg-transparent" key={row.host}>
									<TableCell className="max-w-[220px] truncate pl-6 font-medium"><span className="text-xs">{row.host}</span></TableCell>
									<TableCell className="pr-6 text-end text-muted-foreground text-xs tabular-nums">{formatInteger(row.sessions)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex min-h-[180px] items-center justify-center px-6 text-sm text-muted-foreground">No referrer data available yet.</div>
				)}
			</CardContent>

			<div className="mask-t-from-30% absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-background">
				<Button className="relative" variant="ghost" render={<a href="#" />} nativeButton={false}>
					View All
					<ArrowRightIcon aria-hidden="true" />
				</Button>
			</div>
		</Card>
	);
}
