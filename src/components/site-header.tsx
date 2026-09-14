"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "World", href: "/tags/world" },
  { label: "Tech", href: "/tags/tech" },
  { label: "Football", href: "/tags/football" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 site-header",
        isScrolled && "scrolled"
      )}
    >
      <div className="container-main flex h-16 sm:h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="logo flex-shrink-0">
          REVILE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop About Link */}
        <Link
          href="/about"
          className="hidden md:inline-block nav-link"
        >
          About
        </Link>

        {/* Right Section - Search & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Search Button */}
          <button
            aria-label="Search"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="container-main py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block nav-link px-2 py-2.5"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="block nav-link px-2 py-2.5"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
