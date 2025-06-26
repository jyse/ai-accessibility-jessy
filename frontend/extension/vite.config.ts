import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/index.tsx",
        content: "src/content/content.ts",
        background: "src/background/background.ts"
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});
