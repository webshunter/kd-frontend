# KD Frontend - Kampung Digital Tangsel

Frontend-only version of Kampung Digital Tangsel UMKM Platform.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔧 Backend Connection

- **Backend URL**: https://kdtangsel.hubunk.id
- **API Endpoint**: https://kdtangsel.hubunk.id/api
- **Upload Endpoint**: https://kdtangsel.hubunk.id/uploads

## 📱 Features

- UMKM Directory
- TangselMart Marketplace
- GoodSkill Courses
- HalloHukum Legal Consultation
- Forum Discussion
- Events Management
- Mentoring System
- Job Listings
- Business Matching

## 🎯 Deployment

Ready for deployment to:
- Replit
- Vercel
- Netlify
- GitHub Pages

## 📚 Documentation

- [Frontend Config](frontend-config.md)
- [Lovable Migration Guide](LOVABLE-MIGRATION-GUIDE.md)

## 🔗 Repository Info

- **Source**: Branch `frontend-lovable` from `webshunter/tangsel`
- **Backend**: https://kdtangsel.hubunk.id
- **Status**: Ready for production

## 🛠️ Tech Stack

- **React 19.1.1** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Material Symbols** - Icons

## 📁 Project Structure

```
kd-frontend/
├── components/          # React components
├── views/               # Page components
├── services/            # Frontend services
├── contexts/            # React contexts
├── src/                 # Source files
├── assets/              # Images
├── public/              # Static assets
├── utils/               # Utilities
├── App.tsx              # Main app
├── index.tsx            # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite config
├── tsconfig.json        # TypeScript config
├── types.ts             # Type definitions
└── constants.ts         # App constants
```

## 🔄 Sync with Main Repository

This frontend repository is synced with the main repository `webshunter/tangsel` branch `frontend-lovable`.

### Sync Commands:
```bash
# Update from main repository
git pull origin main

# Copy changes from main repository
cp -r ../tangsel/components/ ./
cp -r ../tangsel/views/ ./
# ... copy other files

# Commit and push changes
git add .
git commit -m "Sync with frontend-lovable branch"
git push origin main
```

## 📄 License

MIT License - Kampung Digital Tangsel Team