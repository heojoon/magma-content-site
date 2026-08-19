import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 4,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
