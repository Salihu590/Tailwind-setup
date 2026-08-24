import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  // Dev Server Configuration (incorporates all requested development fields)
  server: {
    open: true,
    port: 5173,
    host: true,       
    strictPort: true, 
    allowedHosts: true 
  },

  // Production Build Optimization Configuration
  build: {
    target: "es2022",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-framework": ["react", "react-dom", "react-router-dom"],
          "supabase-client": ["@supabase/supabase-js"],
          "vector-library": ["react-icons", "react-icons/io5", "react-icons/fa6"]
        }
      }
    }
  }
});