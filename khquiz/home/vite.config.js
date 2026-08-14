import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { fileURLToPath, URL} from "node:url";
const path = (value)=>fileURLToPath(new URL(value, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  //외부 접속 허용 설정
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      ".trycloudflare.com"
    ]
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path("./src"),
      "@assets": path("./src/assets"),
      "@components": path("./src/components"),
      "@error": path("./src/error"),
      "@templates": path("./src/templates"),
    }
  }
})