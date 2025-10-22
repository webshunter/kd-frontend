import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // IMPORTANT: Backend URL untuk production - JANGAN DIUBAH untuk migrasi Lovable
    // Backend ini akan tetap digunakan sampai migrasi ke Supabase selesai
    const backendUrl = env.VITE_BACKEND_URL || 'https://kdtangsel.hubunk.id';
    const apiPath = env.VITE_API_URL || '/api';
    const frontendUrl = env.VITE_FRONTEND_URL || 'http://localhost:5000';
    const allowedHosts = (env.VITE_ALLOWED_HOSTS || 'tangsel.hubunk.id,kdtangsel.hubunk.id')
      .split(',')
      .map(host => host.trim())
      .filter(Boolean);
    
    // Tambahkan pattern untuk Replit domains
    allowedHosts.push('.replit.dev');
    allowedHosts.push('.repl.co');
    
    return {
      server: {
        port: 5000,
        host: '0.0.0.0', // Penting untuk Replit agar bisa diakses dari luar
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'Cross-Origin-Embedder-Policy': 'unsafe-none',
        },
        // Mengizinkan domain produksi tertentu mengakses dev server
        allowedHosts: allowedHosts.concat(['all']), // Allow all hosts for Replit
        // Konfigurasi untuk Replit
        strictPort: false, // Biarkan Vite mencari port alternatif jika 5000 sibuk
        open: false, // Jangan buka browser otomatis di Replit
        proxy: {
          // Proxy semua request /api ke backend server
          // CATATAN LOVABLE: Jangan ubah schema ini saat migrasi ke Supabase
          // Backend ini akan tetap digunakan sampai migrasi database selesai
          '/api': {
            target: backendUrl,
            changeOrigin: true,
            secure: true, // HTTPS enabled untuk production
            // Optional: add logging untuk debugging
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, _res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log('Sending Request to the Target:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
              });
            },
          },
          // Proxy untuk file uploads
          // CATATAN LOVABLE: Jangan ubah schema ini saat migrasi ke Supabase
          '/uploads': {
            target: backendUrl,
            changeOrigin: true,
            secure: true // HTTPS enabled untuk production
          }
        }
      },
      preview: {
        port: 5000,
        host: '0.0.0.0', // Penting untuk Replit agar bisa diakses dari luar
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'Cross-Origin-Embedder-Policy': 'unsafe-none',
        },
        allowedHosts: allowedHosts.concat(['all']), // Allow all hosts for Replit
        // Konfigurasi untuk Replit
        strictPort: false, // Biarkan Vite mencari port alternatif jika 5000 sibuk
        open: false, // Jangan buka browser otomatis di Replit
        proxy: {
          '/api': {
            target: backendUrl,
            changeOrigin: true,
            secure: true // HTTPS enabled untuk production
          },
          '/uploads': {
            target: backendUrl,
            changeOrigin: true,
            secure: true // HTTPS enabled untuk production
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_API_URL': JSON.stringify(apiPath),
        'process.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
        'process.env.VITE_FRONTEND_URL': JSON.stringify(frontendUrl)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: true
      }
    };
});
