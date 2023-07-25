import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
        clientPort: 5005,
    },
    host: "0.0.0.0",
    strictPort: true,
    port: 5005,
  }
})
