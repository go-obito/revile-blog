"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	footerNavLinks,
	navGroups,
	resolveActiveNavItem,
} from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";

export function AppSidebar({
	userEmail,
}: {
	userEmail: string;
}) {
	const pathname = usePathname();
	const activeItem = resolveActiveNavItem(pathname);

	return (
		<Sidebar
			className="static min-h-full *:data-[slot=sidebar-inner]:bg-background"
			collapsible="offcanvas"
			variant="sidebar"
		>
			<SidebarHeader className="relative h-14 justify-center px-2 py-0">
				<Link
					className="flex h-10 w-max items-center justify-center rounded-lg px-3 hover:bg-muted dark:hover:bg-muted/50"
					href="/admin"
				>
					<Logo className="h-4" />
					<span className="sr-only">Revile</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				{navGroups.map((group, index) => (
					<SidebarGroup key={`sidebar-group-${index}`}>
						{group.label ? (
							<SidebarGroupLabel className="font-normal">
								{group.label}
							</SidebarGroupLabel>
						) : null}
						<SidebarMenu>
							{group.items.map((item) => {
								const isActive =
									item.match?.(pathname) ??
									activeItem?.url === item.url;

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={isActive}
											tooltip={item.title}
											render={<Link href={item.url} />}
										>
											{item.icon}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								className="text-muted-foreground"
								size="sm"
								render={<Link href={item.url} />}
							>
								{item.icon}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<NavUser email={userEmail} />
			</SidebarFooter>
		</Sidebar>
	);
}
