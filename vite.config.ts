import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "grey-ui.js",
      cssFileName: "grey-ui",
    },
    rolldownOptions: {
      // Match Kumo's packaging direction: Base UI is an implementation detail; React stays a peer.
      external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
    },
  },
});
