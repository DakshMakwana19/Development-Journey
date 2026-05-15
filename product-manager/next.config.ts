import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Development-Journey/product-manager",
  assetPrefix: "/Development-Journey/product-manager/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
