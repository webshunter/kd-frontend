# KD Frontend - Replit Setup Guide

## 🚀 Quick Start di Replit

### 1. Import Project
- Upload project ini ke Replit
- Replit akan otomatis mendeteksi konfigurasi Node.js

### 2. Environment Setup
Project sudah dikonfigurasi dengan environment variables default:
- `VITE_BACKEND_URL`: https://kdtangsel.hubunk.id
- `VITE_FRONTEND_URL`: http://localhost:5000
- `VITE_API_URL`: /api

### 3. Menjalankan Project
```bash
# Otomatis akan dijalankan saat Replit start
npm run dev

# Atau gunakan script startup
./start.sh
```

### 4. Akses Aplikasi
- **Local**: http://localhost:5000
- **Public URL**: Replit akan memberikan URL publik untuk akses eksternal

## 📁 File Konfigurasi Replit

### `.replit`
- Konfigurasi utama Replit
- Port: 5000
- Environment variables
- Build commands

### `replit.nix`
- Nix package configuration
- Dependencies yang diperlukan
- Environment setup

### `start.sh`
- Startup script dengan optimasi untuk Replit
- Auto-install dependencies
- Environment setup

## 🔧 Konfigurasi Vite untuk Replit

### Optimasi yang diterapkan:
- `host: '0.0.0.0'` - Memungkinkan akses eksternal
- `strictPort: false` - Port fallback jika 5000 sibuk
- `open: false` - Tidak buka browser otomatis
- Proxy configuration untuk API calls

## 🌐 Backend Integration

Project terintegrasi dengan backend di:
- **Production**: https://kdtangsel.hubunk.id
- **API Path**: /api
- **Uploads**: /uploads

## 📱 Features

- ✅ React 19 + TypeScript
- ✅ Vite 6 untuk development
- ✅ Firebase integration
- ✅ Google Gemini AI
- ✅ Responsive design
- ✅ UMKM Platform features

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## 🔍 Troubleshooting

### Port Issues
Jika port 5000 sibuk, Vite akan otomatis mencari port alternatif.

### Dependencies
Jika ada masalah dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables
Pastikan environment variables sudah diset di Replit secrets atau `.env` file.

## 📞 Support

Untuk bantuan lebih lanjut, hubungi tim Kampung Digital Tangerang Selatan.
