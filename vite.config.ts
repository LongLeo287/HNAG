/// <reference types="vitest/config" />
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// #HNAG M0/M1 build: static Vite SPA, no server runtime. See docs/implementation-plan.md (RS-001).
// NOTE: process.cwd() (not import.meta.url) on purpose — the project root contains a "#"
// character, which URL-based resolution mangles (see docs/decisions.md).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    root: process.cwd(),
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(process.cwd(), "src/test/setup.ts")],
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
