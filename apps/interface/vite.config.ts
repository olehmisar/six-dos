import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import resolve from "vite-plugin-resolve";
import topLevelAwait from "vite-plugin-top-level-await";

const aztecVersion = "0.41.0";

export default defineConfig({
  plugins: [
    react(),
    /** @type {any} */ resolve({
      "@aztec/bb.js": `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
    }),
    nodePolyfills(),
    // esnext target does not work for some reason, so we need this plugin to support top level await
    topLevelAwait(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
  },
});
