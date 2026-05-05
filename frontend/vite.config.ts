import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
          '^/(auth|products|users)': { // regex to match all rotues provided in the brackets
            target: 'http://backend:8000',
            changeOrigin: true,
        },
    }
  },
});

