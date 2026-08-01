import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [
        ...config.externals as unknown[],
        "@libsql/client",
        "@prisma/adapter-libsql",
        "@prisma/client",
      ];
    }
    return config;
  },
};

export default nextConfig;
