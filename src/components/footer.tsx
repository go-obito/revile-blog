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
    <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-slate-200">
      <div className="container-main py-8 sm:py-12">
        {/* Top Section */}
        <div className="grid gap-8 sm:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="logo block mb-2">
              REVILE
            </Link>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500">
              Independent reporting
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 hover:text-slate-900 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Get in touch
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@revile.com"
                  className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={writerDeskHref}
                  className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                  Writer desk
                </a>
              </li>
              <li>
                <a
                  href={adminDeskHref}
                  className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 sm:pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-500">
              © {new Date().getFullYear()} Revile. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition">
                Twitter
              </a>
              <a href="#" className="hover:text-slate-900 transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-slate-900 transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
