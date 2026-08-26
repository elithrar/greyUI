import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/vite-entry.ts",
      formats: ["es"],
      fileName: () => "grey-ui.js",
      cssFileName: "grey-ui",
    },
    rolldownOptions: {
      // Base UI remains bundled; React and React DOM stay peer dependencies.
      external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
    },
  },
});
