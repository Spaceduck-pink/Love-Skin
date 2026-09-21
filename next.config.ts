import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1mb; avatar uploads are capped at 2mb client-side, so
      // leave headroom for multipart/form-data overhead.
      bodySizeLimit: "3mb",
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Source map upload auth token (build-time secret, see .env.local.example)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a wider set of client source files for better stack traces
  widenClientFileUpload: true,

  // Route Sentry requests through the app to dodge ad-blockers
  tunnelRoute: "/monitoring",

  // Suppress noisy build output outside CI
  silent: !process.env.CI,
});
