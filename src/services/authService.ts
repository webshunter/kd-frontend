/**
 * Authentication Service
 * Mengganti implementasi mock dengan API service yang sesungguhnya
 */

import { api, ApiError } from './api';
// User interface compatible with both backend and frontend expectations
interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string; // Compatibility with Dashboard components
  photoURL?: string; // Compatibility with Dashboard components  
  phone?: string;
  role: 'admin' | 'pemkot_staff' | 'kadin_staff' | 'umkm_owner' | 'customer' | 'mentor';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper untuk normalisasi role user dari backend agar konsisten di seluruh UI
const normalizeUserRole = (
  role: string | null | undefined
): User['role'] => {
  const normalized = role?.toLowerCase().trim();

  switch (normalized) {
    case 'admin':
    case 'administrator':
    case 'superadmin':
      return 'admin';
    case 'pemkot_staff':
    case 'pemkot':
    case 'staff_pemkot':
      return 'pemkot_staff';
    case 'kadin_staff':
    case 'kadin':
    case 'staff_kadin':
      return 'kadin_staff';
    case 'umkm_owner':
    case 'umkm':
    case 'pelaku_umkm':
      return 'umkm_owner';
    case 'customer':
    case 'pelanggan':
      return 'customer';
    case 'mentor':
      return 'mentor';
    default:
      return 'umkm_owner';
  }
};

// Authentication request/response interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: 'umkm_owner' | 'customer';
}

interface AuthResponse {
  token?: string;
  refreshToken?: string;
  user: User;
  message?: string;
}

interface VerifyTokenResponse {
  success: boolean;
  user: User;
}

/**
 * Authentication Service Class
 * Mengganti semua mock authentication dengan API calls
 */
class AuthService {
  /**
   * Login user dengan email dan password
   * @param credentials - Email dan password user
   * @returns Promise dengan data response
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Simpan token ke localStorage
        localStorage.setItem('access_token', response.data.token);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        
        // Map backend response untuk compatibility
        const backendUser = response.data.user as any;
        const mappedUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.displayName || backendUser.email.split('@')[0],
          displayName: backendUser.displayName,
          photoURL: backendUser.photoUrl || `https://ui-avatars.com/api/?name=${backendUser.displayName || 'User'}&background=random&color=fff`,
          role: normalizeUserRole(backendUser.role),
          isActive: true,
          emailVerified: backendUser.emailVerified || false,
          createdAt: backendUser.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('Login berhasil untuk user:', mappedUser.email);
        
        return {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          user: mappedUser,
          message: response.message
        };
      }
      
      throw new Error(response.message || 'Login gagal');
    } catch (error) {
      console.error('Login error:', error);
      
      // Bersihkan token jika ada error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      throw error;
    }
  }
  
  /**
   * Register user baru
   * @param userData - Data registrasi user
   * @returns Promise dengan data response
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validasi password confirmation
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Konfirmasi password tidak sesuai');
      }
      
      // Remove confirmPassword dari request
      const { confirmPassword, fullName, ...rest } = userData;

      // Sesuaikan key agar sesuai dengan kebutuhan backend (displayName).
      const displayName = fullName?.trim() || rest.email.split('@')[0] || 'Pengguna';
      const requestPayload = {
        ...rest,
        displayName,
      };
      
      const response = await api.post<AuthResponse>('/auth/register', requestPayload);
      
      if (response.success && response.data) {
        const backendUser = (response.data as any).user;
        if (backendUser) {
          const mappedUser: User = {
            id: backendUser.id,
            email: backendUser.email,
            fullName: backendUser.displayName || backendUser.email?.split('@')[0] || 'Pengguna',
            displayName: backendUser.displayName,
            photoURL: backendUser.photoUrl || `https://ui-avatars.com/api/?name=${backendUser.displayName || 'User'}&background=random&color=fff`,
            role: normalizeUserRole(backendUser.role),
            isActive: backendUser.isActive ?? true,
            emailVerified: backendUser.emailVerified ?? false,
            createdAt: backendUser.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Simpan token ke localStorage jika auto-login
          if ((response.data as any).token) {
            localStorage.setItem('access_token', (response.data as any).token);
            
            if ((response.data as any).refreshToken) {
              localStorage.setItem('refresh_token', (response.data as any).refreshToken);
            }
          }

          console.log('Registrasi berhasil untuk user:', mappedUser.email);
          return {
            token: (response.data as any).token,
            refreshToken: (response.data as any).refreshToken,
            user: mappedUser,
            message: response.message
          };
        }

        return response.data as AuthResponse;
      }
      
      throw new Error(response.message || 'Registrasi gagal');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
  
  /**
   * Verifikasi token yang tersimpan
   * @returns Promise dengan data user jika token valid
   */
  async verifyToken(): Promise<User> {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await api.get<VerifyTokenResponse>('/auth/me');
      
      if (response.success && response.data) {
        // Map backend response ke frontend User interface
        const backendUser = response.data.user as any;
        const user: User = {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.displayName || backendUser.email.split('@')[0],
          displayName: backendUser.displayName,
          photoURL: backendUser.photoUrl || `https://ui-avatars.com/api/?name=${backendUser.displayName || 'User'}&background=random&color=fff`,
          role: normalizeUserRole(backendUser.role),
          isActive: true,
          emailVerified: backendUser.emailVerified || false,
          createdAt: backendUser.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('Token valid untuk user:', user.email);
        return user;
      }
      
      throw new Error('Token verification failed');
    } catch (error) {
      console.warn('Token verification failed:', error);
      
      // Jika token tidak valid, hapus dari localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      throw error;
    }
  }
  
  /**
   * Logout user dan cleanup token
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      // Panggil API logout untuk invalidate token di server
      await api.post('/auth/logout', {});
      
      console.log('User berhasil logout');
    } catch (error) {
      // Even if logout API fails, still clear local data
      console.warn('Logout API gagal, tetapi tetap clear data lokal:', error);
    } finally {
      // Hapus token dari localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
  
  /**
   * Update profil user
   * @param userData - Data yang akan diupdate
   * @returns Promise dengan data user yang updated
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<{ user: User }>('/auth/profile', userData);
      
      if (response.success && response.data) {
        const backendUser = (response.data as any).user;
        const mappedUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.displayName || backendUser.email?.split('@')[0] || 'Pengguna',
          displayName: backendUser.displayName,
          photoURL: backendUser.photoUrl || `https://ui-avatars.com/api/?name=${backendUser.displayName || 'User'}&background=random&color=fff`,
          role: normalizeUserRole(backendUser.role),
          isActive: backendUser.isActive ?? true,
          emailVerified: backendUser.emailVerified ?? false,
          createdAt: backendUser.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Profil berhasil diupdate:', mappedUser.email);
        return mappedUser;
      }
      
      throw new Error(response.message || 'Gagal update profil');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
  
  /**
   * Change password user
   * @param currentPassword - Password saat ini
   * @param newPassword - Password baru
   * @returns Promise<void>
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.success) {
        console.log('Password berhasil diubah');
        return;
      }
      
      throw new Error(response.message || 'Gagal ubah password');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
  
  /**
   * Request password reset
   * @param email - Email user yang ingin reset password
   * @returns Promise<void>
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.success) {
        console.log('Password reset email sent to:', email);
        return;
      }
      
      throw new Error(response.message || 'Gagal mengirim email reset password');
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
  }
  
  /**
   * Reset password dengan token
   * @param token - Token reset password
   * @param newPassword - Password baru
   * @returns Promise<void>
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      
      if (response.success) {
        console.log('Password berhasil direset');
        return;
      }
      
      throw new Error(response.message || 'Gagal reset password');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
  
  /**
   * Refresh access token menggunakan refresh token
   * @returns Promise dengan token baru
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      const response = await api.post<{ token: string }>('/auth/refresh', {
        refreshToken
      });
      
      if (response.success && response.data) {
        // Simpan token baru
        localStorage.setItem('access_token', response.data.token);
        
        console.log('Token berhasil di-refresh');
        return response.data.token;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Refresh token error:', error);
      
      // Jika refresh token gagal, hapus semua token
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      throw error;
    }
  }
  
  /**
   * Check apakah user sudah login
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
  /**
   * Get current user token
   * @returns string | null
   */
  getCurrentToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { LoginRequest, RegisterRequest, AuthResponse, VerifyTokenResponse };