import { defineConfig } from "vitest/config";

// No Vitest unit/component tests here — this app is a thin composition layer
// over @revsys/ui plus Next.js routing/middleware, covered by Playwright e2e
// specs in tests/e2e instead.
export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
  },
});
