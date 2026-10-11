import type { NextConfig } from "next";

// GitHub Pages (static export) mode is activated via NEXT_PUBLIC_STATIC_HOST=1
// and NEXT_PUBLIC_BASE_PATH=/repo-name (set in .github/workflows/pages.yml).
const staticHost = process.env.NEXT_PUBLIC_STATIC_HOST === "1";
const basePath = staticHost ? process.env.NEXT_PUBLIC_BASE_PATH ?? "" : "";

const nextConfig: NextConfig = {
  ...(staticHost
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
      }
    : {}),
  images: { unoptimized: true },
};

export default nextConfig;
