import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Offline-first: precache app shell + cache map tiles, branch data, photos
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            // Map tiles: serve from cache first, refresh in background
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 400, maxAgeSeconds: 30 * 24 * 3600 },
            },
          },
          {
            // Branch search results: network first, fall back to cache offline
            urlPattern: /^https:\/\/.*overpass.*\/api\/interpreter.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'overpass-branches',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 3600 },
            },
          },
          {
            // McDonald's CDN food photos
            urlPattern: /^https:\/\/d3bjzufjcawald\.cloudfront\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcdo-photos',
              expiration: { maxEntries: 150, maxAgeSeconds: 30 * 24 * 3600 },
            },
          },
        ],
      },
    }),
  ],
})
