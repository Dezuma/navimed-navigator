import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev: "/" — Production (GitHub Pages project site): "/navi-med/"
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/navi-med/" : "/",
}));
