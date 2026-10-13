import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  // One ~155 kB (gzipped) bundle is fine for this demo; don't warn about it.
  build: { chunkSizeWarningLimit: 700 },
});
