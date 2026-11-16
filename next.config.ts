import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "globalbizzhub.vercel.app" }],
        destination: "https://www.globalbizzhub.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
