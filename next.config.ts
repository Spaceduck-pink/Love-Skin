import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1mb; avatar uploads are capped at 2mb client-side, so
      // leave headroom for multipart/form-data overhead.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
