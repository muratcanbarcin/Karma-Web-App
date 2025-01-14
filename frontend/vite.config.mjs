import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration for Vite - React build optimization
export default defineConfig({
  build: {
    outDir: "build", // Specifies the output directory for the build files
  },
  plugins: [react()], // Enables React support with Vite
});
