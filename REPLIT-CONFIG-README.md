# KD Frontend - Replit Configuration Guide

## 📁 File Konfigurasi Replit

Project ini dilengkapi dengan konfigurasi Replit yang lengkap dan optimal:

### 1. **`.replit`** - Konfigurasi Utama
File konfigurasi utama Replit dengan:
- ✅ Language: Node.js
- ✅ Nix environment: nixpkgs
- ✅ Run command: `./workflow.sh`
- ✅ Port: 5000
- ✅ Auto-run: enabled
- ✅ Environment variables
- ✅ File management
- ✅ Build configuration

### 2. **`replit.nix`** - Nix Environment
Environment setup dengan dependencies:
- ✅ Node.js 20
- ✅ NPM
- ✅ Git, curl, wget
- ✅ Build tools (gcc, make)
- ✅ Development utilities

### 3. **`replit-settings.json`** - Settings Lengkap
Konfigurasi JSON dengan semua pengaturan:
- ✅ Project metadata
- ✅ Runtime configuration
- ✅ Environment variables
- ✅ Build settings
- ✅ Development tools
- ✅ Git configuration
- ✅ Features dan requirements

### 4. **`replit-config.yaml`** - YAML Configuration
Konfigurasi YAML yang lebih readable:
- ✅ Project information
- ✅ Language settings
- ✅ Nix packages
- ✅ Runtime configuration
- ✅ File management
- ✅ Build settings
- ✅ Development tools
- ✅ Security settings
- ✅ Performance settings

### 5. **`replit-env.example`** - Environment Variables
Template environment variables:
- ✅ Backend configuration
- ✅ Frontend settings
- ✅ Node.js configuration
- ✅ Development settings
- ✅ API keys (template)
- ✅ Replit specific settings
- ✅ Debugging settings
- ✅ CORS settings
- ✅ Cache settings
- ✅ Notification settings
- ✅ Theme settings
- ✅ Performance settings
- ✅ Security settings
- ✅ Monitoring settings
- ✅ Feature flags

### 6. **`replit-setup.sh`** - Setup Script
Script setup otomatis untuk Replit:
- ✅ Check Replit environment
- ✅ Verify system requirements
- ✅ Setup environment variables
- ✅ Check project files
- ✅ Setup permissions
- ✅ Install dependencies
- ✅ Verify installation
- ✅ Provide next steps

## 🚀 Cara Menggunakan

### Import ke Replit:
1. **Upload project** ke Replit
2. **Replit otomatis load** konfigurasi dari `.replit`
3. **Environment setup** dari `replit.nix`
4. **Auto-run** `workflow.sh`

### Manual Setup (jika diperlukan):
```bash
# Jalankan setup script
./replit-setup.sh

# Atau jalankan workflow langsung
./workflow.sh
```

### Environment Variables:
```bash
# Copy template environment
cp replit-env.example .env

# Edit sesuai kebutuhan
nano .env
```

## 🔧 Konfigurasi yang Tersedia

### Runtime:
- **Port**: 5000 (dengan fallback otomatis)
- **Host**: 0.0.0.0 (untuk akses eksternal)
- **Auto-run**: Enabled
- **Hot reload**: Enabled

### Environment:
- **Node.js**: 20.x
- **NPM**: Latest
- **Memory**: 4GB limit
- **Storage**: Unlimited

### Features:
- ✅ Auto-pull dari GitHub
- ✅ Auto-install dependencies
- ✅ Auto-start development server
- ✅ Port fallback
- ✅ Security audit
- ✅ Build test
- ✅ Error handling
- ✅ Logging

### Development Tools:
- ✅ TypeScript LSP
- ✅ ESLint
- ✅ Debugger
- ✅ File associations
- ✅ Git integration

## 📊 Monitoring & Debugging

### Logs:
- **Console**: Real-time output
- **Errors**: Colorized error messages
- **Warnings**: Yellow warnings
- **Success**: Green success messages

### Debugging:
- **Debugger**: Enabled
- **Source maps**: Enabled
- **Hot reload**: Enabled
- **Error tracking**: Enabled

### Performance:
- **Bundle analysis**: Available
- **Memory monitoring**: Enabled
- **CPU monitoring**: Available
- **Network monitoring**: Available

## 🛠️ Troubleshooting

### Common Issues:

#### 1. npm tidak ditemukan:
```bash
# Jalankan setup script
./replit-setup.sh

# Atau install manual
nix-env -iA nixpkgs.nodePackages.npm
```

#### 2. Port 5000 sibuk:
```bash
# Vite akan otomatis cari port lain
# Check terminal output untuk port yang digunakan
```

#### 3. Dependencies error:
```bash
# Clean install
npm run clean

# Atau manual
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment variables tidak load:
```bash
# Restart Replit
# Atau jalankan setup script
./replit-setup.sh
```

### Debug Commands:
```bash
# Check environment
env | grep VITE

# Check Node.js
node --version
npm --version

# Check files
ls -la

# Check permissions
ls -la *.sh
```

## 📚 File Reference

| File | Purpose | Required |
|------|---------|----------|
| `.replit` | Main Replit config | ✅ Yes |
| `replit.nix` | Nix environment | ✅ Yes |
| `workflow.sh` | Main workflow script | ✅ Yes |
| `replit-settings.json` | JSON settings | ❌ Optional |
| `replit-config.yaml` | YAML config | ❌ Optional |
| `replit-env.example` | Env template | ❌ Optional |
| `replit-setup.sh` | Setup script | ❌ Optional |

## 🔗 Links

- **Repository**: https://github.com/webshunter/kd-frontend
- **Replit**: Import project ke Replit
- **Backend**: https://kdtangsel.hubunk.id
- **Documentation**: README-FRONTEND.md

## 📞 Support

Untuk bantuan lebih lanjut:
- Check GitHub Issues
- Review workflow logs
- Contact Kampung Digital Team
- Check Replit documentation
