/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    forceRerunTriggers: [
      "**/package.json/**",
      "**/vitest.config.*/**",
      "**/vite.config.*/**",
      "**/*.sh",
    ],
  },
});
