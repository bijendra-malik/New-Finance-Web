import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || /node_modules\/react(\/|-dom)/.test(id)) return 'vendor-react';
            if (id.includes('i18next')) return 'vendor-i18n';
            if (id.includes('axios')) return 'vendor-api';
          }
        },
      },
    },
  },
})
