import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Unit + component tests. E2E lives in tests/e2e and is run by Playwright,
// never by Vitest (the include list keeps them apart).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/component/**/*.test.{ts,tsx}",
    ],
    css: false,
  },
  resolve: {
    // The "@/…" alias, same as tsconfig's paths
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
