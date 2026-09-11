"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarClock,
  ChevronDown,
  FileText,
  Home,
  Menu,
  Palette,
  Plus,
  Search,
  Sparkles,
  Newspaper,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/posts", label: "Blog", icon: FileText },
  { href: "/admin/posts/new", label: "Article", icon: Newspaper },
  { href: "/admin/analytics", label: "Theme", icon: Palette },
  { href: "/admin/comments", label: "Schedule", icon: CalendarClock },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const displayName = userEmail?.includes("@") ? userEmail.split("@")[0] : userEmail || "Admin";

  const renderNavLink = ({ href, label, icon: Icon, compact = false }: { href: string; label: string; icon: any; compact?: boolean }) => {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));

    return (
      <Link
        key={href}
        href={href}
        title={label}
        onClick={() => setMobileOpen(false)}
        className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        } ${compact ? "justify-center px-0" : "gap-3"}`}
        aria-label={label}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!compact && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-5 pb-5 pt-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">R</div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-slate-400">Publishing</p>
              <p className="text-[22px] font-semibold tracking-[0.12em] text-slate-900">REVILE</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <Link
              href="/admin/posts/new"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Article
            </Link>
          </div>

          <nav className="flex-1 px-3 pb-4">
            <div className="space-y-1">
              {navItems.map((item) => renderNavLink({ ...item, compact: false }))}
            </div>
          </nav>

          <div className="px-4 pb-5">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 text-slate-800 shadow-sm">
              <div className="mb-3 flex items-center justify-center text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-center text-xl font-semibold text-slate-900">Launch Your Blog!</h3>
              <p className="mt-2 text-center text-sm leading-6 text-slate-600">
                Many helpful features will be open for you and you can launch your own blog with ease.
              </p>
              <button type="button" className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50">
                Upgrade Plan
              </button>
            </div>
          </div>

          <div className="mt-auto px-4 pb-4">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/admin" className="hover:text-slate-900">Help</Link>
              <Link href="/admin" className="hover:text-slate-900">Terms Service</Link>
            </div>
          </div>
        </aside>

        <aside className="hidden w-[72px] shrink-0 border-r border-slate-200 bg-white md:flex lg:hidden md:flex-col">
          <div className="flex items-center justify-center px-2 pb-5 pt-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">R</div>
          </div>

          <div className="px-2 pb-3">
            <Link
              href="/admin/posts/new"
              title="Create Article"
              aria-label="Create Article"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>

          <nav className="flex-1 px-2 pb-4">
            <div className="space-y-2">
              {navItems.map((item) => renderNavLink({ ...item, compact: true }))}
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 h-[64px] border-b border-slate-200 bg-white/90 backdrop-blur-xl lg:h-[72px]">
            <div className="flex h-full items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3 lg:w-[260px] lg:shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="hidden items-center gap-3 lg:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">R</div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-slate-400">Publishing</p>
                    <p className="text-[22px] font-semibold tracking-[0.12em] text-slate-900">REVILE</p>
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                <div className="hidden min-w-0 max-w-[440px] flex-1 justify-end md:flex">
                  <div className="relative w-full max-w-[440px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value="Searching..."
                      readOnly
                      className="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none"
                      aria-label="Search"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </button>

                <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-700" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-sky-200 text-xs font-semibold text-blue-700">
                    MB
                  </div>
                  <span className="hidden pr-1 text-sm font-medium text-slate-700 md:inline">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-slate-50">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-4 md:px-6 md:py-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-[85%] max-w-sm bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">R</div>
                <p className="text-[22px] font-semibold tracking-[0.12em] text-slate-900">REVILE</p>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-slate-200 p-2 text-slate-700" aria-label="Close navigation">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <Link
                href="/admin/posts/new"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Article
              </Link>
            </div>

            <nav className="mt-6 space-y-1">
              {navItems.map((item) => renderNavLink({ ...item, compact: false }))}
            </nav>
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-900/20 md:hidden"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="border-b border-slate-200 bg-white p-3 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                defaultValue="Search"
                className="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-10 text-sm text-slate-600 outline-none"
                aria-label="Search posts"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
