import Link from "next/link";

const NAV_ITEMS = [
	{ label: "Latest", href: "/" },
	{ label: "World", href: "/tags/world" },
	{ label: "Tech", href: "/tags/tech" },
	{ label: "Football", href: "/tags/football" },
	{ label: "About", href: "/about" },
];

export function Footer() {
	return (
		<footer className="mt-16">
			<div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
				<div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<Link href="/" className="logo text-lg font-extrabold tracking-[0.22em] text-slate-900 hover:text-blue-700">
							REVILE
						</Link>
						<span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:inline-block">
							Independent reporting
						</span>
					</div>

					<nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 md:gap-5">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="transition hover:text-slate-900"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-3 text-sm font-medium text-slate-600">
						<a href="mailto:hello@revile.com" className="transition hover:text-slate-900">
							Contact
						</a>
						<Link href="/admin/login" className="transition hover:text-slate-900">
							Writer desk
						</Link>
					</div>
				</div>

				<div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
					<p>&copy; {new Date().getFullYear()} Revile. All rights reserved.</p>
					<div className="flex flex-wrap items-center gap-4">
						<Link href="/about" className="hover:text-slate-900">
							Privacy
						</Link>
						<Link href="/about" className="hover:text-slate-900">
							Terms
						</Link>
						<Link href="/admin/login" className="hover:text-slate-900">
							Admin
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
