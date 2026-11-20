import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'privacy.html',
          'screenshots/screen-wide.jpg',
          'screenshots/screen-narrow.jpg',
        ],
        manifest: {
          id: '/',
          name: 'إِيَادُ المُسْلِم – د مسلمان ملګری',
          short_name: 'إياد المسلم',
          description: 'د مسلمان د ورځني عبادت، قرآن، حدیث، اذکارو، لمانځه وختونو، قبلې او اسلامي مطالعې جامع ملګری.',
          lang: 'ps',
          dir: 'rtl',
          orientation: 'any',
          theme_color: '#0b4f3a',
          background_color: '#061813',
          display: 'standalone',
          display_override: ['standalone', 'minimal-ui'],
          start_url: '/',
          scope: '/',
          categories: ['lifestyle', 'education', 'books'],
          prefer_related_applications: false,
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'د لمانځه وختونه · Prayer Times',
              short_name: 'لمونځ',
              url: '/?module=prayer',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'قرآن کریم · Quran Karim',
              short_name: 'قرآن',
              url: '/?module=quran',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'ورځني اذکار · Adhkar',
              short_name: 'اذکار',
              url: '/?module=adhkar',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'قبله‌نما · Qibla',
              short_name: 'قبله',
              url: '/?module=qibla',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
          screenshots: [
            {
              src: '/screenshots/screen-wide.jpg',
              sizes: '1280x720',
              type: 'image/jpeg',
              form_factor: 'wide',
              label: 'إِيَادُ المُسْلِم – د مسلمان ملګری (Desktop Glass UI)',
            },
            {
              src: '/screenshots/screen-narrow.jpg',
              sizes: '720x1280',
              type: 'image/jpeg',
              form_factor: 'narrow',
              label: 'إِيَادُ المُسْلِم – د مسلمان ملګری (Mobile Glass UI)',
            },
          ],
        },
        workbox: {
          navigateFallback: 'index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
