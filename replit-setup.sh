#!/bin/bash

# Replit Setup Script untuk KD Frontend Project
# Kampung Digital Tangerang Selatan - UMKM Platform
# Script ini akan setup environment Replit dengan optimal

set -e  # Exit on any error

echo "🔧 KD Frontend - Replit Setup Starting..."

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function untuk install Node.js
install_nodejs() {
    print_status "Installing Node.js 20..."
    
    # Method 1: Try using nix (for Replit)
    if command -v nix-env &> /dev/null; then
        print_status "Using nix to install Node.js..."
        nix-env -iA nixpkgs.nodejs_20 || {
            print_warning "Nix installation failed, trying alternative method..."
        }
    fi
    
    # Method 2: Try using apt (for Ubuntu/Debian)
    if ! command -v node &> /dev/null && command -v apt-get &> /dev/null; then
        print_status "Using apt to install Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs || {
            print_warning "Apt installation failed, trying alternative method..."
        }
    fi
    
    # Method 3: Try using snap
    if ! command -v node &> /dev/null && command -v snap &> /dev/null; then
        print_status "Using snap to install Node.js..."
        sudo snap install node --classic || {
            print_warning "Snap installation failed, trying alternative method..."
        }
    fi
    
    # Method 4: Try using nvm
    if ! command -v node &> /dev/null; then
        print_status "Using nvm to install Node.js..."
        if [ ! -d "$HOME/.nvm" ]; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        nvm install 20
        nvm use 20
    fi
    
    # Verify installation
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        print_success "Node.js installed successfully: $node_version"
        
        # Check if npm is also available
        if ! command -v npm &> /dev/null; then
            print_status "Installing npm..."
            if command -v nix-env &> /dev/null; then
                nix-env -iA nixpkgs.nodePackages.npm
            elif command -v apt-get &> /dev/null; then
                sudo apt-get install -y npm
            fi
        fi
    else
        print_error "Failed to install Node.js using all available methods!"
        print_info "Please install Node.js manually:"
        print_info "1. Visit https://nodejs.org/"
        print_info "2. Download and install Node.js 20 or later"
        print_info "3. Restart this script"
        exit 1
    fi
}

# Function untuk install npm
install_npm() {
    print_status "Installing npm..."
    
    # Method 1: Try using nix (for Replit)
    if command -v nix-env &> /dev/null; then
        print_status "Using nix to install npm..."
        nix-env -iA nixpkgs.nodePackages.npm || {
            print_warning "Nix npm installation failed, trying alternative method..."
        }
    fi
    
    # Method 2: Try using apt (for Ubuntu/Debian)
    if ! command -v npm &> /dev/null && command -v apt-get &> /dev/null; then
        print_status "Using apt to install npm..."
        sudo apt-get update
        sudo apt-get install -y npm || {
            print_warning "Apt npm installation failed, trying alternative method..."
        }
    fi
    
    # Method 3: Try using snap
    if ! command -v npm &> /dev/null && command -v snap &> /dev/null; then
        print_status "Using snap to install npm..."
        sudo snap install npm --classic || {
            print_warning "Snap npm installation failed, trying alternative method..."
        }
    fi
    
    # Method 4: Try using nvm (if available)
    if ! command -v npm &> /dev/null && [ -d "$HOME/.nvm" ]; then
        print_status "Using nvm to install npm..."
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 20
        nvm use 20
    fi
    
    # Method 5: Try installing npm directly
    if ! command -v npm &> /dev/null && command -v node &> /dev/null; then
        print_status "Installing npm directly..."
        curl -L https://npmjs.org/install.sh | sh || {
            print_warning "Direct npm installation failed, trying alternative method..."
        }
    fi
    
    # Verify installation
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        print_success "npm installed successfully: $npm_version"
    else
        print_error "Failed to install npm using all available methods!"
        print_info "Please install npm manually:"
        print_info "1. Make sure Node.js is installed"
        print_info "2. Visit https://www.npmjs.com/get-npm"
        print_info "3. Follow the installation instructions"
        print_info "4. Restart this script"
        exit 1
    fi
}

print_status() {
    echo -e "${BLUE}[SETUP]${NC} $1"
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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Step 1: Check Replit Environment
print_header "Step 1: Checking Replit Environment"

print_status "Checking if running in Replit..."
if [ -n "$REPL_ID" ] || [ -n "$REPL_SLUG" ]; then
    print_success "Running in Replit environment!"
    print_info "REPL_ID: ${REPL_ID:-'Not set'}"
    print_info "REPL_SLUG: ${REPL_SLUG:-'Not set'}"
else
    print_warning "Not running in Replit environment, but continuing..."
fi

# Step 2: Check System Requirements
print_header "Step 2: Checking System Requirements"

print_status "Checking Node.js..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    print_success "Node.js found: $node_version"
    
    # Check if version is >= 20
    node_major=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
    if [ "$node_major" -ge 20 ]; then
        print_success "Node.js version is compatible (>= 20)"
    else
        print_warning "Node.js version might be too old (< 20)"
        print_status "Attempting to install Node.js 20..."
        install_nodejs
    fi
else
    print_warning "Node.js not found! Attempting to install..."
    install_nodejs
fi

print_status "Checking npm..."
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    print_success "npm found: $npm_version"
else
    print_warning "npm not found! Attempting to install..."
    install_npm
fi

print_status "Checking git..."
if command -v git &> /dev/null; then
    git_version=$(git --version)
    print_success "Git found: $git_version"
else
    print_warning "Git not found, but not critical for basic setup"
fi

# Step 3: Setup Environment Variables
print_header "Step 3: Setting up Environment Variables"

print_status "Setting up environment variables..."
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=4096"
export VITE_BACKEND_URL="https://kdtangsel.hubunk.id"
export VITE_API_URL="/api"
export VITE_FRONTEND_URL="http://localhost:5000"
export VITE_ALLOWED_HOSTS="tangsel.hubunk.id,kdtangsel.hubunk.id"
export CI=false
export DISABLE_ESLINT_PLUGIN=true

print_success "Environment variables set!"

# Step 4: Check Project Files
print_header "Step 4: Checking Project Files"

required_files=(
    "package.json"
    "vite.config.ts"
    "index.html"
    "workflow.sh"
    ".replit"
    "replit.nix"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file found"
    else
        print_error "✗ $file missing!"
        exit 1
    fi
done

# Step 5: Setup Permissions
print_header "Step 5: Setting up Permissions"

print_status "Making scripts executable..."
chmod +x workflow.sh 2>/dev/null || print_warning "workflow.sh not found or already executable"
chmod +x start.sh 2>/dev/null || print_warning "start.sh not found or already executable"
chmod +x replit-setup.sh 2>/dev/null || print_warning "replit-setup.sh not found or already executable"

print_success "Scripts made executable!"

# Step 6: Install Dependencies
print_header "Step 6: Installing Dependencies"

print_status "Installing npm dependencies..."
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies for the first time..."
        npm install
        print_success "Dependencies installed successfully!"
    else
        print_status "Dependencies already exist, checking for updates..."
        npm install
        print_success "Dependencies updated successfully!"
    fi
else
    print_error "package.json not found!"
    exit 1
fi

# Step 7: Verify Installation
print_header "Step 7: Verifying Installation"

print_status "Running security audit..."
npm audit --audit-level=moderate || print_warning "Some vulnerabilities found"

print_status "Testing TypeScript compilation..."
npx tsc --noEmit || print_warning "TypeScript compilation has warnings"

print_status "Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_success "Build test passed!"
    rm -rf dist  # Clean up build files
else
    print_warning "Build test failed, but continuing..."
fi

# Step 8: Setup Complete
print_header "Setup Complete!"

print_success "🎉 KD Frontend Replit setup completed successfully!"
print_info "📁 Project files verified"
print_info "📦 Dependencies installed"
print_info "🔧 Environment configured"
print_info "🚀 Ready to run!"

print_header "Next Steps"
echo "1. Run './workflow.sh' to start development server"
echo "2. Or run 'npm run dev' directly"
echo "3. Access your app at http://localhost:5000"
echo "4. Replit will provide a public URL for external access"

print_header "Available Commands"
echo "• ./workflow.sh     - Full workflow (recommended)"
echo "• npm run dev       - Start development server"
echo "• npm run build     - Build for production"
echo "• npm run preview   - Preview production build"
echo "• npm run lint      - Run ESLint"
echo "• npm run type-check - Run TypeScript check"

print_success "Setup completed! Happy coding! 🚀"
