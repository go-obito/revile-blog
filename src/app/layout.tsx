import type { Metadata } from "next";
import { Montserrat, Poppins, Roboto } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-cta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Revile",
  description: "Independent reporting and analysis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f5f7fb] text-slate-900">{children}</body>
    </html>
  );
}
