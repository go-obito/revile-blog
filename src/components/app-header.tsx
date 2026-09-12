"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { resolveActiveNavItem } from "@/components/app-shared";
import { BellIcon, HeadsetIcon, LogOutIcon, SearchIcon } from "lucide-react";

export function AppHeader() {
	const pathname = usePathname();
	const activeItem = resolveActiveNavItem(pathname);
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/admin/login");
		router.refresh();
	}

	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 bg-background px-4 md:px-6"
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger className="md:hidden" />
				<Separator
					className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
					orientation="vertical"
				/>
				<AppBreadcrumbs page={activeItem} />
			</div>
			<div className="flex items-center gap-2">
				<Button aria-label="Search" size="icon" variant="ghost">
					<SearchIcon />
				</Button>
				<Button aria-label="Notifications" size="icon" variant="ghost">
					<BellIcon />
				</Button>
				<Button aria-label="Support" size="icon" variant="ghost" render={<a href="/about" />} nativeButton={false}>
					<HeadsetIcon />
				</Button>
				<Button aria-label="Log out" size="icon" variant="ghost" onClick={handleLogout}>
					<LogOutIcon />
				</Button>
			</div>
		</header>
	);
}
