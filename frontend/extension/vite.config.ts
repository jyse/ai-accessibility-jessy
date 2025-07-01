import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "./src/styles/globals.css";`
      }
    }
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        popup: "index.html",
        content: "src/content/content.ts",
        background: "src/background/background.ts"
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    }
  }
});
