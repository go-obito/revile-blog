import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      // Cover images may be served from ImageKit (or any https host the
      // uploads flow produces); next/image refuses unconfigured hosts.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
