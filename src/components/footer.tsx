import Link from "next/link";
import { getAdminDeskLink, getWriterDeskLink } from "@/lib/auth";

const NAV_ITEMS = [
	{ label: "Latest", href: "/" },
	{ label: "World", href: "/tags/world" },
	{ label: "Tech", href: "/tags/tech" },
	{ label: "Football", href: "/tags/football" },
	{ label: "About", href: "/about" },
];

export async function Footer() {
	const writerDeskHref = await getWriterDeskLink();
	const adminDeskHref = await getAdminDeskLink();

	return (
		<footer className="mt-8 sm:mt-12 lg:mt-16">
			<div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
				<div className="flex flex-col gap-3 sm:gap-4 px-4 py-4 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<Link href="/" className="logo text-lg font-extrabold tracking-[0.22em] text-slate-900 hover:text-blue-700 whitespace-nowrap">
							REVILE
						</Link>
						<span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:inline-block">
							Independent reporting
						</span>
					</div>

					<nav className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-600 md:gap-5">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="transition hover:text-slate-900 whitespace-nowrap"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-600 md:gap-3 md:whitespace-nowrap">
						<a href="mailto:hello@revile.com" className="transition hover:text-slate-900">
							Contact
						</a>
						<a href={writerDeskHref} className="transition hover:text-slate-900">
							Writer desk
						</a>
					</div>
				</div>

				<div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:py-4 text-xs sm:text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
					<p className="line-clamp-1">&copy; {new Date().getFullYear()} Revile. All rights reserved.</p>
					<div className="flex flex-wrap items-center gap-3 sm:gap-4">
						<Link href="/about" className="hover:text-slate-900">
							Privacy
						</Link>
						<Link href="/about" className="hover:text-slate-900">
							Terms
						</Link>
						<a href={adminDeskHref} className="hover:text-slate-900">
							Admin
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
