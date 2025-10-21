# Frontend Configuration untuk Lovable Migration

## 🔧 **KONFIGURASI VITE**

### **Backend URL Configuration**
```typescript
// vite.config.ts
const backendUrl = env.VITE_BACKEND_URL || 'https://kdtangsel.hubunk.id';
const apiPath = env.VITE_API_URL || '/api';
```

### **Proxy Configuration**
```typescript
proxy: {
  // Proxy semua request /api ke backend server
  // CATATAN LOVABLE: Jangan ubah schema ini saat migrasi ke Supabase
  '/api': {
    target: 'https://kdtangsel.hubunk.id',
    changeOrigin: true,
    secure: true, // HTTPS enabled
  },
  '/uploads': {
    target: 'https://kdtangsel.hubunk.id',
    changeOrigin: true,
    secure: true, // HTTPS enabled
  }
}
```

## 🌐 **ENVIRONMENT VARIABLES**

Buat file `.env.local` dengan konfigurasi berikut:

```bash
# Backend API URL - Production
VITE_BACKEND_URL=https://kdtangsel.hubunk.id
VITE_API_URL=/api

# Frontend URL
VITE_FRONTEND_URL=http://localhost:9057

# Allowed Hosts
VITE_ALLOWED_HOSTS=tangsel.hubunk.id,kdtangsel.hubunk.id

# Gemini API Key (jika diperlukan)
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## ⚠️ **CATATAN PENTING UNTUK LOVABLE**

### **1. Jangan Ubah Schema Backend**
- Backend URL: `https://kdtangsel.hubunk.id/api`
- Upload URL: `https://kdtangsel.hubunk.id/uploads`
- Schema ini akan tetap digunakan sampai migrasi ke Supabase selesai

### **2. Proxy Configuration**
- Semua request `/api/*` akan di-proxy ke `https://kdtangsel.hubunk.id/api/*`
- Semua request `/uploads/*` akan di-proxy ke `https://kdtangsel.hubunk.id/uploads/*`
- HTTPS enabled untuk production security

### **3. Migrasi ke Supabase**
- Frontend akan tetap menggunakan backend existing
- Database akan di-migrate ke Supabase secara terpisah
- Backend API akan di-update untuk menggunakan Supabase
- Frontend tidak perlu diubah selama proses migrasi

## 🚀 **CARA MENJALANKAN**

### **1. Setup Environment**
```bash
# Copy template environment
cp frontend-config.md .env.local

# Edit .env.local sesuai kebutuhan
# Pastikan VITE_BACKEND_URL=https://kdtangsel.hubunk.id
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Run Frontend**
```bash
npm run dev
```

### **4. Test API Connection**
- Frontend akan berjalan di `http://localhost:9057`
- API calls akan di-proxy ke `https://kdtangsel.hubunk.id/api`
- Pastikan backend production berjalan dengan baik

## 🔍 **VERIFIKASI KONFIGURASI**

### **Check Proxy Working**
1. Buka browser developer tools
2. Lihat Network tab
3. Lakukan API call dari frontend
4. Pastikan request di-proxy ke `https://kdtangsel.hubunk.id/api`

### **Check HTTPS Connection**
1. Pastikan backend production menggunakan HTTPS
2. Check SSL certificate valid
3. Test API endpoints langsung

## 📝 **TROUBLESHOOTING**

### **Proxy Error**
```
Error: proxy error
Solution: Check backend URL dan pastikan HTTPS valid
```

### **CORS Error**
```
Error: CORS policy
Solution: Backend harus allow origin frontend
```

### **API Not Found**
```
Error: 404 Not Found
Solution: Check API endpoint dan backend status
```

---

**Last Updated**: 2025-01-27  
**Branch**: `frontend-lovable`  
**Status**: ✅ Ready with Production Backend
