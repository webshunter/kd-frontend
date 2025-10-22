# Nix configuration untuk KD Frontend Project
# Kampung Digital Tangerang Selatan - UMKM Platform

{ pkgs }: {
  deps = [
    # Node.js dan npm
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    
    # Development tools
    pkgs.git
    pkgs.curl
    pkgs.wget
    
    # Build tools
    pkgs.gcc
    pkgs.gnumake
    
    # Python (untuk beberapa native dependencies)
    pkgs.python3
    
    # Additional utilities
    pkgs.jq
    pkgs.htop
    pkgs.tree
  ];
  
  # Environment variables
  env = {
    # Node.js configuration
    NODE_ENV = "development";
    NODE_OPTIONS = "--max-old-space-size=4096";
    
    # Vite configuration
    VITE_BACKEND_URL = "https://kdtangsel.hubunk.id";
    VITE_API_URL = "/api";
    VITE_FRONTEND_URL = "http://localhost:5000";
    VITE_ALLOWED_HOSTS = "tangsel.hubunk.id,kdtangsel.hubunk.id";
    
    # Development settings
    CI = "false";
    DISABLE_ESLINT_PLUGIN = "true";
  };
  
  # Shell configuration
  shell = pkgs.bash;
  
  # Build inputs
  buildInputs = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.git
  ];
}
