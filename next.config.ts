import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/uptime",
        destination: "https://rpc.digitalregion.jp/api/uptime",
      },
    ];
  },
};

export default nextConfig;