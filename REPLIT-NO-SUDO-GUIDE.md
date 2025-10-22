# Replit Setup Guide - Tanpa Sudo

## 🚫 Mengapa Replit Tidak Mengizinkan Sudo?

Replit adalah platform cloud development yang membatasi akses root (`sudo`) untuk:
- **Keamanan**: Mencegah akses ke sistem inti
- **Stabilitas**: Menjaga konsistensi environment
- **Isolasi**: Memisahkan proyek pengguna

## ✅ Solusi untuk Replit

### 1. **Gunakan Nix Package Manager (Recommended)**
Replit mendukung Nix untuk instalasi paket tanpa sudo:

```nix
# replit.nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.git
    pkgs.curl
    pkgs.wget
  ];
}
```

### 2. **Gunakan NVM (Node Version Manager)**
Install Node.js di home directory tanpa sudo:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install 20
nvm use 20
```

### 3. **Download Binary Langsung**
Download dan extract Node.js binary ke home directory:

```bash
# Download Node.js binary
NODE_VERSION="20.19.0"
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    NODE_ARCH="x64"
elif [ "$ARCH" = "aarch64" ]; then
    NODE_ARCH="arm64"
fi

NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"
curl -fsSL "$NODE_URL" -o "/tmp/node.tar.xz"
tar -xf "/tmp/node.tar.xz" -C "$HOME"
mv "$HOME/node-v${NODE_VERSION}-linux-${NODE_ARCH}" "$HOME/node-${NODE_VERSION}"

# Add to PATH
export PATH="$HOME/node-${NODE_VERSION}/bin:$PATH"
echo 'export PATH="$HOME/node-20.19.0/bin:$PATH"' >> "$HOME/.bashrc"
```

## 🔧 Script yang Sudah Diperbaiki

### `replit-setup.sh` - Metode Tanpa Sudo:

#### 1. **Nix Installation (Method 1)**
```bash
# Coba nix-env (Replit default)
if command -v nix-env &> /dev/null; then
    nix-env -iA nixpkgs.nodejs_20
    nix-env -iA nixpkgs.nodePackages.npm
fi
```

#### 2. **NVM Installation (Method 2)**
```bash
# Install nvm dan Node.js
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi
nvm install 20
nvm use 20
```

#### 3. **Binary Download (Method 3)**
```bash
# Download Node.js binary langsung
NODE_VERSION="20.19.0"
ARCH=$(uname -m)
NODE_ARCH="x64"  # atau "arm64" untuk ARM
NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"
curl -fsSL "$NODE_URL" -o "/tmp/node.tar.xz"
tar -xf "/tmp/node.tar.xz" -C "$HOME"
export PATH="$HOME/node-${NODE_VERSION}/bin:$PATH"
```

## 📋 Langkah Setup di Replit

### Step 1: Import Project
1. Buka Replit
2. Import project dari GitHub
3. Replit akan otomatis load `replit.nix`

### Step 2: Environment Setup
```bash
# Jalankan setup script
./replit-setup.sh

# Atau jalankan workflow
./workflow.sh
```

### Step 3: Verify Installation
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check nix packages
nix-env -q
```

## 🛠️ Troubleshooting

### Node.js tidak terinstall:
1. **Check replit.nix**: Pastikan ada `pkgs.nodejs_20`
2. **Restart Replit**: Restart environment setelah edit `replit.nix`
3. **Check nix**: `nix-env -q` untuk lihat packages

### npm tidak terinstall:
1. **Check replit.nix**: Pastikan ada `pkgs.nodePackages.npm`
2. **Check Node.js**: Pastikan Node.js sudah terinstall
3. **Use nvm**: Install via nvm jika nix gagal

### Permission denied:
1. **No sudo**: Jangan gunakan `sudo` di Replit
2. **Use home directory**: Install di `$HOME/`
3. **Check PATH**: Pastikan `$HOME/node-*/bin` di PATH

## 📚 Best Practices untuk Replit

### 1. **Gunakan replit.nix**
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.git
    pkgs.curl
  ];
  
  env = {
    NODE_ENV = "development";
    PATH = "$HOME/node-20.19.0/bin:$PATH";
  };
}
```

### 2. **Setup Environment Variables**
```bash
# Di .replit atau replit.nix
NODE_ENV=development
NODE_OPTIONS=--max-old-space-size=4096
VITE_BACKEND_URL=https://kdtangsel.hubunk.id
```

### 3. **Gunakan Script Setup**
```bash
# Otomatis setup semua dependencies
./replit-setup.sh

# Atau workflow lengkap
./workflow.sh
```

## 🔗 Referensi

- [Replit Documentation](https://docs.replit.com/)
- [Nix Package Manager](https://nixos.org/)
- [NVM GitHub](https://github.com/nvm-sh/nvm)
- [Node.js Downloads](https://nodejs.org/download/)

## ⚠️ Yang Tidak Bisa Dilakukan di Replit

- ❌ `sudo apt-get install`
- ❌ `sudo snap install`
- ❌ `sudo npm install -g`
- ❌ Edit system files
- ❌ Install system packages

## ✅ Yang Bisa Dilakukan di Replit

- ✅ `nix-env -iA nixpkgs.package`
- ✅ `nvm install node`
- ✅ Download binary ke home directory
- ✅ Install packages di project directory
- ✅ Setup environment variables
- ✅ Use package managers (npm, yarn, pnpm)
