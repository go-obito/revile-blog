import {
	LayoutGridIcon,
	BarChart3Icon,
	MessageSquareTextIcon,
	SparklesIcon,
	PlusIcon,
	HelpCircleIcon,
	ExternalLinkIcon,
} from "lucide-react";

export type SidebarNavItem = {
	title: string;
	url: string;
	icon: React.ReactNode;
	isActive?: boolean;
	match?: (pathname: string) => boolean;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Content",
		items: [
			{
				title: "Dashboard",
				url: "/admin",
				icon: <LayoutGridIcon />,
				match: (pathname) => pathname === "/admin",
			},
			{
				title: "New post",
				url: "/admin/posts/new",
				icon: <PlusIcon />,
				match: (pathname) => pathname === "/admin/posts/new",
			},
			{
				title: "Comments",
				url: "/admin/comments",
				icon: <MessageSquareTextIcon />,
				match: (pathname) => pathname.startsWith("/admin/comments"),
			},
		],
	},
	{
		label: "Insights",
		items: [
			{
				title: "Analytics",
				url: "/admin/analytics",
				icon: <BarChart3Icon />,
				match: (pathname) => pathname.startsWith("/admin/analytics"),
			},
			{
				title: "Insights",
				url: "/admin/insights",
				icon: <SparklesIcon />,
				match: (pathname) => pathname.startsWith("/admin/insights"),
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "View site",
		url: "/",
		icon: <ExternalLinkIcon data-icon="inline-start" />,
	},
	{
		title: "Help",
		url: "/about",
		icon: <HelpCircleIcon />,
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) => group.items),
	...footerNavLinks,
];

export function resolveActiveNavItem(pathname: string) {
	return (
		navLinks.find((item) => item.match?.(pathname)) ??
		navLinks.find((item) => item.url === pathname) ??
		null
	);
}
