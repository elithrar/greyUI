import { readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const componentsDir = resolve(rootDir, "src/components");
const syncStoreShim = resolve(rootDir, "src/vendor/use-sync-external-store-shim.ts");
const syncStoreSelector = resolve(rootDir, "src/vendor/use-sync-external-store-with-selector.ts");

const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")),
    )
    .map((entry) => {
      const name = basename(entry.name, extname(entry.name));
      return [`components/${name}`, resolve(componentsDir, entry.name)];
    }),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "use-sync-external-store/shim/with-selector", replacement: syncStoreSelector },
      { find: "use-sync-external-store/shim", replacement: syncStoreShim },
    ],
  },
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, "src/vite-entry.ts"),
        ...componentEntries,
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "grey-ui",
    },
    rolldownOptions: {
      // Base UI stays bundled into the shared graph. React and React DOM remain peers.
      external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
        hoistTransitiveImports: false,
      },
    },
  },
});
