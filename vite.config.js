import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRouter from "@vitejs/plugin-react-router";

export default defineConfig({
  plugins: [react(), reactRouter()],
});
