import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use './' so static hosting works under any path (e.g. GitHub Pages project sites).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
