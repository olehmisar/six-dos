import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 999999999,
    hookTimeout: 999999999,
    teardownTimeout: 999999999,
  },
});
