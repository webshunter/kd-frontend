#!/bin/bash

# Startup script untuk KD Frontend Project di Replit
# Kampung Digital Tangerang Selatan - UMKM Platform

echo "🚀 Starting KD Frontend Project..."

# Set environment variables untuk Replit
export NODE_ENV=development
export VITE_BACKEND_URL=https://kdtangsel.hubunk.id
export VITE_API_URL=/api
export VITE_FRONTEND_URL=http://localhost:5000
export VITE_ALLOWED_HOSTS=tangsel.hubunk.id,kdtangsel.hubunk.id

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if dependencies are up to date
echo "🔍 Checking dependencies..."
npm outdated || true

# Start the development server
echo "🌐 Starting Vite development server on port 5000..."
echo "📱 Access your app at: http://localhost:5000"
echo "🔗 Replit will provide a public URL for external access"

# Start Vite with optimized settings for Replit
npm run dev
