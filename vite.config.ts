import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    cssMinify: "esbuild",
  },
  plugins: [tanstackStart(), nitro(), viteReact()],
});
