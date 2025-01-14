import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Configuration for Vite - a fast build tool optimized for modern web development
export default defineConfig({
  plugins: [react()], // Enables React-specific optimizations and JSX support
  publicDir: "./static", // Directory for serving static assets
  base: "./", // Base public path for the application
});
