import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["primereact/chart"], // Thêm PrimeReact Chart vào danh sách tối ưu
  },
  server: {
    host: "localhost", // Specify the host
    port: 3000, // Specify the port
  },
});
