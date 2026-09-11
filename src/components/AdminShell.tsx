"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  CircleHelp,
  FileText,
  FolderSearch,
  Globe,
  ImageIcon,
  LayoutGrid,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Tag,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/comments", label: "Comments", icon: MessageSquareText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audience", label: "Audience", icon: Users },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/categories", label: "Categories", icon: FolderSearch },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">R</div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-slate-400">Publishing</p>
              <p className="text-lg font-semibold tracking-[0.12em]">REVILE</p>
            </div>
          </div>

          <nav className="flex-1 space-y-6 px-3 py-5">
            <div className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-slate-800 p-3">
            <div className="space-y-1">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                <Globe className="h-4 w-4" />
                View site
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                <CircleHelp className="h-4 w-4" />
                Help
              </Link>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in</p>
              <p className="mt-1 truncate text-sm font-medium text-white">{userEmail}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                  <p className="text-sm font-semibold text-slate-900">Revile admin</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" className="hidden rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 sm:inline-flex" aria-label="Search">
                  <Search className="h-4 w-4" />
                </button>
                <button type="button" className="inline-flex rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-200 hover:text-blue-700" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 sm:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">A</div>
                  <span className="text-sm font-medium text-slate-700">Admin</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="h-full w-[85%] max-w-sm bg-slate-950 p-4 text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">R</div>
                <p className="text-lg font-semibold tracking-[0.14em]">REVILE</p>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-slate-700 p-2 text-slate-200" aria-label="Close navigation">
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
