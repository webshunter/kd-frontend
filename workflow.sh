#!/bin/bash

# Workflow Script untuk KD Frontend Project di Replit
# Kampung Digital Tangerang Selatan - UMKM Platform
# Script ini akan: pull latest changes, install dependencies, dan run dev server

set -e  # Exit on any error

echo "🚀 KD Frontend Workflow - Starting..."

# Colors untuk output yang lebih menarik
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check Git status dan pull latest changes
print_status "Step 1: Checking Git repository..."

if [ -d ".git" ]; then
    print_status "Git repository found. Checking for updates..."
    
    # Check if we're on main branch
    current_branch=$(git branch --show-current)
    print_status "Current branch: $current_branch"
    
    # Fetch latest changes
    print_status "Fetching latest changes from remote..."
    git fetch origin
    
    # Check if there are updates
    if git diff HEAD origin/main --quiet; then
        print_success "Repository is up to date!"
    else
        print_status "Updates available. Pulling latest changes..."
        git pull origin main
        print_success "Successfully pulled latest changes!"
    fi
else
    print_warning "No Git repository found. Skipping pull step."
fi

# Step 2: Set environment variables
print_status "Step 2: Setting up environment variables..."

export NODE_ENV=development
export VITE_BACKEND_URL=https://kdtangsel.hubunk.id
export VITE_API_URL=/api
export VITE_FRONTEND_URL=http://localhost:5000
export VITE_ALLOWED_HOSTS=tangsel.hubunk.id,kdtangsel.hubunk.id
export CI=false
export DISABLE_ESLINT_PLUGIN=true

print_success "Environment variables set!"

# Step 3: Check Node.js version
print_status "Step 3: Checking Node.js version..."
node_version=$(node --version)
print_status "Node.js version: $node_version"

# Step 4: Install or update dependencies
print_status "Step 4: Managing dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "node_modules not found. Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully!"
else
    print_status "node_modules found. Checking for updates..."
    
    # Check if package-lock.json exists and is newer than node_modules
    if [ -f "package-lock.json" ] && [ "package-lock.json" -nt "node_modules" ]; then
        print_status "package-lock.json is newer. Updating dependencies..."
        npm install
        print_success "Dependencies updated successfully!"
    else
        print_status "Dependencies are up to date!"
    fi
fi

# Step 5: Check for vulnerabilities
print_status "Step 5: Checking for security vulnerabilities..."
npm audit --audit-level=moderate || print_warning "Some vulnerabilities found. Run 'npm audit fix' to fix them."

# Step 6: Build check (optional)
print_status "Step 6: Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_success "Build test passed!"
    # Clean up build files
    rm -rf dist
else
    print_warning "Build test failed, but continuing with dev server..."
fi

# Step 7: Start development server
print_status "Step 7: Starting development server..."
print_success "🎉 All setup complete! Starting Vite dev server..."
print_status "📱 Access your app at: http://localhost:5000"
print_status "🔗 Replit will provide a public URL for external access"
print_status "⚡ Hot reload is enabled - changes will auto-refresh"

# Start the development server
exec npm run dev
