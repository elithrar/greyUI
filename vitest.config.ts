import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// SAFETY: package.json is repository-owned and npm requires `version` to be a string.
const { version: packageVersion } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

export default defineConfig({
  plugins: [react()],
  define: {
    BUILD_GREYUI_VERSION: JSON.stringify(packageVersion),
  },
  test: {
    environment: "jsdom",
    exclude: ["tests/browser/**", "**/node_modules/**", "**/.git/**"],
  },
});
