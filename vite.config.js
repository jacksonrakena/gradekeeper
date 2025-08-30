import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), eslint(), sentryVitePlugin({
    org: "jacksonrakena",
    project: "gk-client"
  })],

  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@routes",
        replacement: fileURLToPath(new URL("./src/routes", import.meta.url)),
      },
    ],
  },

  build: {
    sourcemap: true
  }
});