#!/bin/bash

# Test Script untuk Node.js Installation
# Script ini akan test fungsi instalasi Node.js

set -e

echo "🧪 Testing Node.js Installation Functions..."

# Simulate environment without Node.js
export PATH_BACKUP="$PATH"

# Function untuk test install_nodejs
test_install_nodejs() {
    echo "Testing install_nodejs function..."
    
    # Temporarily remove node from PATH
    export PATH=$(echo "$PATH" | sed 's|/usr/bin:||g' | sed 's|/usr/local/bin:||g')
    
    # Define simple test functions
    print_status() { echo "[TEST] $1"; }
    print_success() { echo "✅ $1"; }
    print_warning() { echo "⚠️ $1"; }
    print_error() { echo "❌ $1"; }
    
    # Test the function
    if command -v node &> /dev/null; then
        echo "✅ Node.js is available, testing version check..."
        node_version=$(node --version)
        echo "Node.js version: $node_version"
        
        # Test version compatibility
        node_major=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
        if [ "$node_major" -ge 20 ]; then
            echo "✅ Node.js version is compatible (>= 20)"
        else
            echo "⚠️ Node.js version might be too old (< 20)"
        fi
    else
        echo "❌ Node.js not found - this would trigger install_nodejs()"
    fi
    
    # Restore PATH
    export PATH="$PATH_BACKUP"
}

# Function untuk test install_npm
test_install_npm() {
    echo "Testing install_npm function..."
    
    if command -v npm &> /dev/null; then
        echo "✅ npm is available"
        npm_version=$(npm --version)
        echo "npm version: $npm_version"
    else
        echo "❌ npm not found - this would trigger install_npm()"
    fi
}

# Function untuk test system requirements
test_system_requirements() {
    echo "Testing system requirements..."
    
    # Check available package managers
    echo "Available package managers:"
    if command -v nix-env &> /dev/null; then
        echo "✅ nix-env available"
    else
        echo "❌ nix-env not available"
    fi
    
    if command -v apt-get &> /dev/null; then
        echo "✅ apt-get available"
    else
        echo "❌ apt-get not available"
    fi
    
    if command -v snap &> /dev/null; then
        echo "✅ snap available"
    else
        echo "❌ snap not available"
    fi
    
    if [ -d "$HOME/.nvm" ]; then
        echo "✅ nvm directory exists"
    else
        echo "❌ nvm directory not found"
    fi
}

# Run tests
echo "=========================================="
echo "Running Node.js Installation Tests"
echo "=========================================="

test_system_requirements
echo ""
test_install_nodejs
echo ""
test_install_npm

echo "=========================================="
echo "Test completed!"
echo "=========================================="
