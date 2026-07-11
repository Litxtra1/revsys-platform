import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Linting is enforced monorepo-wide via the root `pnpm lint` (Turborepo) pipeline,
    // not duplicated inside the Next.js build step.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
