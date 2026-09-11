import Link from "next/link";
import { FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="mt-16 overflow-hidden rounded-t-[28px] bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white shadow-[0_-18px_40px_rgba(15,23,42,0.08)]">
      <div className="mx-auto max-w-7xl grid gap-10 px-6 py-10 md:grid-cols-[1.5fr_0.9fr_0.9fr_1.1fr] md:px-10">
        <div>
          <div className="logo text-2xl font-extrabold tracking-[0.2em] text-white">REVILE</div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-blue-100">
            Independent reporting and thoughtful analysis for the people who want clarity, context, and the stories behind the headlines.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://x.com" aria-label="X" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white hover:text-blue-900">
              <FiTwitter className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white hover:text-blue-900">
              <FiLinkedin className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white hover:text-blue-900">
              <FiInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Sections</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-50">
            <li><Link href="/" className="transition hover:text-white">Latest</Link></li>
            <li><Link href="/tags/world" className="transition hover:text-white">World</Link></li>
            <li><Link href="/tags/tech" className="transition hover:text-white">Tech</Link></li>
            <li><Link href="/tags/football" className="transition hover:text-white">Football</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Company</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-50">
            <li><Link href="/about" className="transition hover:text-white">About</Link></li>
            <li><a href="mailto:hello@revile.com" className="transition hover:text-white">Contact</a></li>
            <li><a href="/admin/login" className="transition hover:text-white">Writer desk</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Newsletter</h3>
          <p className="mt-4 text-sm leading-7 text-blue-100">
            The brief, sent every Friday with the stories worth your attention.
          </p>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100 focus:border-blue-200"
            />
            <button type="button" className="primary-button nav-cta inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:translate-y-[-1px]">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>© 2026 Revile. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/about" className="hover:text-white">Privacy</a>
            <a href="/about" className="hover:text-white">Terms</a>
            <a href="/admin/login" className="hover:text-white">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
