import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Do not advertise the framework in response headers. */
  poweredByHeader: false,
  /**
   * These packages ship hundreds of small modules. Rewriting the imports lets
   * the bundler tree-shake them so unused components never reach the client.
   */
  experimental: {
    optimizePackageImports: ["motion", "@react-three/drei"],
  },
};

export default nextConfig;

