import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Untuk GitHub Pages project site (https://<user>.github.io/<repo>),
  // base path harus = nama repo. Vercel tidak butuh base khusus (root).
  const isGitHubPages = mode === "ghpages";
  return {
    plugins: [react()],
    base: isGitHubPages ? "/Aplikasi-Payroll-HR/" : "./",
    server: { host: "127.0.0.1" },
    preview: { host: "127.0.0.1" },
  };
});
