# Node.js Installation Guide untuk Replit

## 🔧 Fitur Instalasi Otomatis Node.js

Script `replit-setup.sh` telah dilengkapi dengan fitur instalasi otomatis Node.js dan npm jika belum tersedia.

## 📋 Metode Instalasi yang Didukung

### 1. **Nix (Replit Default)**
```bash
# Method 1: Menggunakan nix (untuk Replit)
nix-env -iA nixpkgs.nodejs_20
nix-env -iA nixpkgs.nodePackages.npm
```

### 2. **APT (Ubuntu/Debian)**
```bash
# Method 2: Menggunakan apt (untuk Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs npm
```

### 3. **Snap**
```bash
# Method 3: Menggunakan snap
sudo snap install node --classic
sudo snap install npm --classic
```

### 4. **NVM (Node Version Manager)**
```bash
# Method 4: Menggunakan nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
```

### 5. **Direct Installation**
```bash
# Method 5: Instalasi langsung
curl -L https://npmjs.org/install.sh | sh
```

## 🚀 Cara Kerja Script

### Step 1: Check Node.js
```bash
if command -v node &> /dev/null; then
    # Node.js ditemukan, cek versi
    node_version=$(node --version)
    node_major=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
    if [ "$node_major" -ge 20 ]; then
        # Versi kompatibel (>= 20)
    else
        # Versi terlalu lama, install ulang
        install_nodejs
    fi
else
    # Node.js tidak ditemukan, install
    install_nodejs
fi
```

### Step 2: Check npm
```bash
if command -v npm &> /dev/null; then
    # npm ditemukan
else
    # npm tidak ditemukan, install
    install_npm
fi
```

### Step 3: Install Node.js (jika diperlukan)
```bash
install_nodejs() {
    # Coba method 1: nix
    if command -v nix-env &> /dev/null; then
        nix-env -iA nixpkgs.nodejs_20
    fi
    
    # Coba method 2: apt
    if ! command -v node &> /dev/null && command -v apt-get &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Coba method 3: snap
    if ! command -v node &> /dev/null && command -v snap &> /dev/null; then
        sudo snap install node --classic
    fi
    
    # Coba method 4: nvm
    if ! command -v node &> /dev/null; then
        # Install nvm jika belum ada
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 20
        nvm use 20
    fi
    
    # Verify installation
    if command -v node &> /dev/null; then
        print_success "Node.js installed successfully!"
    else
        print_error "Failed to install Node.js!"
        exit 1
    fi
}
```

### Step 4: Install npm (jika diperlukan)
```bash
install_npm() {
    # Coba method 1: nix
    if command -v nix-env &> /dev/null; then
        nix-env -iA nixpkgs.nodePackages.npm
    fi
    
    # Coba method 2: apt
    if ! command -v npm &> /dev/null && command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y npm
    fi
    
    # Coba method 3: snap
    if ! command -v npm &> /dev/null && command -v snap &> /dev/null; then
        sudo snap install npm --classic
    fi
    
    # Coba method 4: nvm
    if ! command -v npm &> /dev/null && [ -d "$HOME/.nvm" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 20
        nvm use 20
    fi
    
    # Coba method 5: direct
    if ! command -v npm &> /dev/null && command -v node &> /dev/null; then
        curl -L https://npmjs.org/install.sh | sh
    fi
    
    # Verify installation
    if command -v npm &> /dev/null; then
        print_success "npm installed successfully!"
    else
        print_error "Failed to install npm!"
        exit 1
    fi
}
```

## 🧪 Testing

### Test Script
```bash
# Jalankan test script
./test-nodejs-install.sh
```

### Manual Test
```bash
# Test Node.js
node --version

# Test npm
npm --version

# Test setup script
./replit-setup.sh
```

## 🔍 Troubleshooting

### Node.js tidak terinstall:
1. **Check package managers**: Pastikan ada apt, snap, atau nix
2. **Check permissions**: Pastikan ada akses sudo
3. **Check network**: Pastikan koneksi internet stabil
4. **Manual install**: Install manual dari https://nodejs.org/

### npm tidak terinstall:
1. **Check Node.js**: Pastikan Node.js sudah terinstall
2. **Check package managers**: Pastikan ada apt, snap, atau nix
3. **Manual install**: Install manual dari https://www.npmjs.com/get-npm

### Version tidak kompatibel:
1. **Check version**: `node --version`
2. **Update Node.js**: Install versi 20 atau lebih baru
3. **Use nvm**: Gunakan nvm untuk manage multiple versions

## 📊 Status Check

### System Requirements:
- ✅ Node.js >= 20.0.0
- ✅ npm >= 9.0.0
- ✅ Git (optional)
- ✅ Package manager (apt/snap/nix)

### Available Methods:
- ✅ nix-env (Replit default)
- ✅ apt-get (Ubuntu/Debian)
- ✅ snap (Universal)
- ✅ nvm (Version manager)
- ✅ Direct installation

## 🚀 Usage

### Di Replit:
```bash
# Import project ke Replit
# Replit akan otomatis jalankan setup script
./replit-setup.sh
```

### Manual:
```bash
# Jalankan setup script
./replit-setup.sh

# Atau jalankan workflow
./workflow.sh
```

## 📚 References

- [Node.js Official Website](https://nodejs.org/)
- [npm Official Website](https://www.npmjs.com/)
- [NVM GitHub](https://github.com/nvm-sh/nvm)
- [Replit Documentation](https://docs.replit.com/)
- [Nix Package Manager](https://nixos.org/)

## 🔧 Customization

### Tambah Package Manager Lain:
```bash
# Tambah di install_nodejs()
if ! command -v node &> /dev/null && command -v yum &> /dev/null; then
    sudo yum install -y nodejs npm
fi
```

### Ubah Version Requirement:
```bash
# Ubah di script
if [ "$node_major" -ge 18 ]; then  # Ubah dari 20 ke 18
    print_success "Node.js version is compatible (>= 18)"
fi
```

### Tambah Logging:
```bash
# Tambah logging detail
print_status "Installing Node.js using method: $method"
echo "Installation log: $log_file"
```
