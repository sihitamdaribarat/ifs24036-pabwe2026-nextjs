import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/**",
        "src/app/**",
        "src/components/Providers.tsx",
        "src/setupTests.ts",
        "src/lib/config.ts",
        "src/types/**",
        "src/hooks/redux.ts",
        "src/server.ts",
        "src/test-utils.tsx",
        "scripts/**",
        "vitest.config.mts",
        "vitest.config.mjs",
        "next.config.ts",
        "postcss.config.mjs",
        "eslint.config.mjs",
        ".next/**",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
