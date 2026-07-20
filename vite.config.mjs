/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"]
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"]
      }
    })
  ],
  test: {
    globals: true,
    environment: "jsdom"
  },
  build: {
    outDir: "build"
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, "./src/app")
    }
  },
  server: {
    proxy: {
      "/robott": {
        target: "http://192.168.19.72",
        changeOrigin: true
      }
    },
    port: 3000
  }
});
