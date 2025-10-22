# KD Frontend - Workflow & Deployment Guide

## 🚀 Automated Workflow System

Project ini dilengkapi dengan sistem workflow otomatis untuk memudahkan development dan deployment di Replit.

## 📁 File Workflow

### 1. `workflow.sh` - Main Workflow Script
Script utama yang akan dijalankan otomatis di Replit:
- ✅ Pull latest changes dari GitHub
- ✅ Install/update dependencies
- ✅ Set environment variables
- ✅ Run security audit
- ✅ Test build process
- ✅ Start development server

### 2. `.replit` - Replit Configuration
Konfigurasi utama Replit:
- Port: 5000
- Auto-run: `./workflow.sh`
- Environment variables
- Build commands

### 3. `replit.nix` - Nix Environment
Environment setup untuk Replit:
- Node.js 20
- NPM
- Development tools
- Environment variables

## 🔄 GitHub Actions Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
**Trigger**: Push ke main/develop, Pull requests

**Jobs**:
- **Test & Lint**: ESLint, TypeScript check, Build test
- **Security Audit**: NPM audit, vulnerability check
- **Performance Check**: Bundle size analysis
- **Deploy to Replit**: Auto-deployment (jika main branch)

### 2. Replit Deployment (`.github/workflows/replit-deploy.yml`)
**Trigger**: Manual dispatch, Push ke main

**Features**:
- Manual deployment dengan environment selection
- Build artifacts untuk Replit import
- Deployment summary dan next steps

## 🛠️ Cara Menggunakan

### Di Replit:
1. **Import Project**: Upload project ke Replit
2. **Auto Setup**: Replit akan otomatis menjalankan `workflow.sh`
3. **Development**: Server akan start di port 5000
4. **Auto-sync**: Perubahan akan otomatis di-sync

### Manual Commands:
```bash
# Jalankan workflow lengkap
./workflow.sh

# Atau step by step
git pull origin main
npm install
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## 🔧 Environment Variables

### Default (sudah dikonfigurasi):
```bash
NODE_ENV=development
VITE_BACKEND_URL=https://kdtangsel.hubunk.id
VITE_API_URL=/api
VITE_FRONTEND_URL=http://localhost:5000
VITE_ALLOWED_HOSTS=tangsel.hubunk.id,kdtangsel.hubunk.id
CI=false
DISABLE_ESLINT_PLUGIN=true
```

### Custom (jika diperlukan):
Tambahkan di Replit Secrets atau `.env` file:
```bash
GEMINI_API_KEY=your_api_key_here
VITE_CUSTOM_VAR=your_value_here
```

## 📊 Workflow Features

### ✅ Auto-Pull
- Otomatis pull latest changes dari GitHub
- Check branch status
- Handle merge conflicts

### ✅ Auto-Install
- Install dependencies jika `node_modules` tidak ada
- Update dependencies jika `package-lock.json` berubah
- Cache management

### ✅ Auto-Start
- Start development server otomatis
- Port fallback (5000 → 5001 jika sibuk)
- Hot reload enabled

### ✅ Security & Quality
- NPM audit untuk security vulnerabilities
- ESLint untuk code quality
- TypeScript type checking
- Build test sebelum start

## 🚨 Troubleshooting

### Port Issues:
```bash
# Jika port 5000 sibuk, Vite akan otomatis cari port lain
# Check di terminal output untuk port yang digunakan
```

### Dependencies Issues:
```bash
# Clean install
npm run clean

# Atau manual
rm -rf node_modules package-lock.json
npm install
```

### Git Issues:
```bash
# Reset ke main branch
git checkout main
git pull origin main

# Atau force pull
git fetch origin
git reset --hard origin/main
```

### Build Issues:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npm run lint

# Check build
npm run build
```

## 📈 Monitoring

### GitHub Actions:
- Check workflow status di GitHub Actions tab
- View logs untuk debugging
- Download artifacts jika diperlukan

### Replit Logs:
- Check terminal output di Replit
- Monitor resource usage
- Check network requests

## 🔗 Links

- **Repository**: https://github.com/webshunter/kd-frontend
- **Replit**: Import project ke Replit
- **Backend**: https://kdtangsel.hubunk.id
- **Documentation**: README-FRONTEND.md

## 📞 Support

Untuk bantuan lebih lanjut:
- Check GitHub Issues
- Contact Kampung Digital Team
- Review workflow logs
