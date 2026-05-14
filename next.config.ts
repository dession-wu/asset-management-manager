import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      '@asset-manager/shared': path.resolve(__dirname, '../shared/index.ts'),
    },
  },
  webpack: (config) => {
    config.resolve.alias['@asset-manager/shared'] = path.resolve(__dirname, '../shared/index.ts');
    return config;
  },
};

export default nextConfig;
