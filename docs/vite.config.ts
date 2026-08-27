import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const docsRoot = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const syncStoreShim = resolve(projectRoot, "src/vendor/use-sync-external-store-shim.ts");
const syncStoreSelector = resolve(
  projectRoot,
  "src/vendor/use-sync-external-store-with-selector.ts",
);
const { version: packageVersion } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

export default defineConfig({
  root: docsRoot,
  plugins: [react()],
  resolve: {
    alias: [
      { find: "use-sync-external-store/shim/with-selector", replacement: syncStoreSelector },
      { find: "use-sync-external-store/shim", replacement: syncStoreShim },
    ],
  },
  define: {
    BUILD_GREYUI_VERSION: JSON.stringify(packageVersion),
  },
  server: {
    fs: {
      allow: [projectRoot],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 20,
            },
            {
              name: "base-ui",
              test: /node_modules[\\/](?:@base-ui|@floating-ui|@babel[\\/]runtime|use-sync-external-store)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
