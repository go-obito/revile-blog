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

export function TopPages({ rows: dataRows }: { rows?: Array<{ path: string; visits: number; delta: number }> }) {
	const rowsToRender = dataRows ?? [];

	return (
		<Card className="relative md:col-span-2 dark:bg-transparent">
			<CardHeader>
				<CardTitle className="text-balance">Top pages</CardTitle>
				<CardDescription className="text-pretty">First page in session, ranked by visits.</CardDescription>
			</CardHeader>
			<CardContent className="mask-b-from-50% mask-b-to-100% p-0 pb-2">
				{rowsToRender.length ? (
					<Table className="border-t">
						<TableCaption className="sr-only">Top landing pages by visits with year-over-year change.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="pl-6" scope="col">Path</TableHead>
								<TableHead className="text-end tabular-nums" scope="col">Visits</TableHead>
								<TableHead className="pr-6 text-end" scope="col">Change</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rowsToRender.map((row) => (
								<TableRow className="hover:bg-transparent" key={row.path}>
									<TableCell className="max-w-[200px] truncate pl-6 font-medium">
										<span className="w-max rounded border border-border bg-muted/50 px-1 py-px text-xs">{row.path}</span>
									</TableCell>
									<TableCell className="text-end text-muted-foreground text-xs tabular-nums">{formatInteger(row.visits)}</TableCell>
									<TableCell className="pr-6 text-end text-muted-foreground text-xs"><span className="tabular-nums">{row.delta > 0 ? "+" : ""}{row.delta}%</span></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex min-h-[180px] items-center justify-center px-6 text-sm text-muted-foreground">No page traffic data yet.</div>
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
