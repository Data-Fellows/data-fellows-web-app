import { defineConfig } from "vitest/config";

// No test runner existed in this repo before this file -- added
// specifically to cover the new /api/contact enquiry endpoint per the
// brief's explicit test requirements. Scoped to server-side logic
// (API routes, lib/) rather than component/browser testing, which this
// repo verifies manually via build + Playwright screenshots instead (see
// PR descriptions in this repo's history).
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
