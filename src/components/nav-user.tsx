"use client";

import { useRouter } from "next/navigation";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	ChevronsUpDownIcon,
	ExternalLinkIcon,
	LogOutIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";

function displayNameFromEmail(email: string) {
	const local = email.includes("@") ? email.split("@")[0] : email;
	return local
		.replace(/[._-]/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function NavUser({ email }: { email: string }) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const name = displayNameFromEmail(email || "Admin");
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("") || "A";

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/admin/login");
		router.refresh();
	}

	return (
		<SidebarMenu className="border-t p-2">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton className="text-muted-foreground" />
						}
					>
						<Avatar className="size-5">
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">
							{name.split(" ")[0]}
						</span>
						<ChevronsUpDownIcon className="ml-auto size-3!" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-48"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem disabled>
								<UserIcon />
								{email}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								render={<a href="/admin/analytics" />}
							>
								<SettingsIcon />
								Analytics
							</DropdownMenuItem>
							<DropdownMenuItem render={<a href="/" />}>
								<ExternalLinkIcon />
								View site
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={handleLogout}
						>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
