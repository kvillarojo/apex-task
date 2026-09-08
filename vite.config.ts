import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker when new code is built
      includeAssets: ['favicon.svg', 'icons.svg', 'apex-task-icon.svg'],
      manifest: {
        name: "Apex Task",
        short_name: 'TaskBoard',
        description: 'Manage tasks.',
        theme_color: '#6366f1', // Match your app's navy/dark background
        background_color: '#1e1e2e',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icons.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'apex-task-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable' // Essential for clean rounded icons on Android
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('quill')) {
              return 'vendor-quill';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
