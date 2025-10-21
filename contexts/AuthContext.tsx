import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../src/services/authService';
import { api, ApiError } from '../src/services/api';

// User interface - Real user dari database with compatibility fields
interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string; // Compatibility field
  photoURL?: string; // Compatibility field  
  phone?: string;
  role: 'admin' | 'pemkot_staff' | 'kadin_staff' | 'umkm_owner' | 'customer' | 'mentor';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth context interface dengan API integration
interface AuthContextType {
    user: User | null;
    role: User['role'] | null; // Add role property for backward compatibility
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (displayName: string, email: string, password: string, role?: 'umkm_owner' | 'customer') => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    // Helper methods
    isAuthenticated: boolean;
    hasRole: (role: User['role']) => boolean;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (role: string | null | undefined): User['role'] => {
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
        case 'customer':
        case 'pelanggan':
            return 'customer';
        case 'mentor':
            return 'mentor';
        case 'umkm_owner':
        case 'umkm':
        case 'pelaku_umkm':
        default:
            return 'umkm_owner';
    }
};

const mapBackendUser = (rawUser: any): User => {
    const displayName = rawUser.displayName || rawUser.fullName || rawUser.email?.split('@')[0] || 'Pengguna';
    const now = new Date().toISOString();

    return {
        id: rawUser.id,
        email: rawUser.email,
        fullName: displayName,
        displayName,
        photoURL: rawUser.photoUrl || rawUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`,
        phone: rawUser.phone,
        role: normalizeRole(rawUser.role),
        isActive: rawUser.isActive ?? true,
        emailVerified: rawUser.emailVerified ?? rawUser.email_verified ?? false,
        createdAt: rawUser.createdAt || rawUser.created_at || now,
        updatedAt: rawUser.updatedAt || rawUser.updated_at || now,
    };
};

const resolveOAuthAllowedOrigins = (): string[] => {
    const originSet = new Set<string>();

    const pushOrigin = (value?: string | null) => {
        if (!value) {
            return;
        }
        const trimmed = value.trim();
        if (!trimmed) {
            return;
        }
        try {
            const normalized = new URL(trimmed).origin;
            originSet.add(normalized);
            return;
        } catch {
            // Fallback apabila nilai sudah berupa origin valid tanpa skema eksplisit.
            originSet.add(trimmed);
        }
    };

    const rawConfigured = (import.meta.env.VITE_OAUTH_ALLOWED_ORIGINS || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);

    rawConfigured.forEach(pushOrigin);

    pushOrigin(import.meta.env.VITE_FRONTEND_URL);
    pushOrigin(import.meta.env.VITE_BACKEND_URL || 'http://localhost:9059');
    pushOrigin(import.meta.env.VITE_API_URL);

    if (typeof window !== 'undefined') {
        pushOrigin(window.location.origin);
    }

    return Array.from(originSet);
};


/**
 * AuthProvider Component - Real API Integration
 * Mengganti semua mock authentication dengan backend API
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State untuk user yang sedang login
    const [user, setUser] = useState<User | null>(null);
    // State untuk loading saat verifikasi token
    const [loading, setLoading] = useState(true);

    const PERSISTED_USER_KEY = 'auth_user';

    interface PersistedUserPayload {
        mode: 'demo' | 'real';
        user: User;
    }

    /**
     * Daftar akun demo untuk kebutuhan pengembangan front-end tanpa backend aktif.
     * ⚠️ Jangan gunakan di production.
     */
    const DEMO_ACCOUNTS: Array<Pick<User, 'email' | 'fullName' | 'role'>> = [
        { email: 'customer@kampungdigital.test', fullName: 'Customer Tangsel', role: 'customer' },
        { email: 'umkm@kampungdigital.test', fullName: 'Pelaku UMKM', role: 'umkm_owner' },
        { email: 'pemkot@kampungdigital.test', fullName: 'Staf Pemkot', role: 'pemkot_staff' },
        { email: 'kadin@kampungdigital.test', fullName: 'Staf KADIN', role: 'kadin_staff' },
        { email: 'admin@kampungdigital.test', fullName: 'Administrator Tangsel', role: 'admin' },
    ];
    const DEMO_PASSWORD = 'Password123';

    /**
     * Membuat user mock berdasarkan konfigurasi demo.
     */
    const createMockUser = (demoAccount: Pick<User, 'email' | 'fullName' | 'role'>): User => {
        const now = new Date().toISOString();
        return {
            id: `demo-${demoAccount.role}`,
            email: demoAccount.email,
            fullName: demoAccount.fullName,
            displayName: demoAccount.fullName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(demoAccount.fullName)}&background=random&color=fff`,
            phone: undefined,
            role: demoAccount.role,
            isActive: true,
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
        };
    };

    /**
     * Menyimpan user (demo maupun real) ke localStorage agar sesi bertahan setelah refresh atau restart browser.
     */
    const persistUser = (payload: PersistedUserPayload) => {
        localStorage.setItem(PERSISTED_USER_KEY, JSON.stringify(payload));
    };

    const persistRealSession = (rawUser: any, token?: string, refreshToken?: string): User => {
        if (token) {
            localStorage.setItem('access_token', token);
        }

        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }

        const normalizedUser = mapBackendUser(rawUser);
        setUser(normalizedUser);
        persistUser({ mode: 'real', user: normalizedUser });

        return normalizedUser;
    };

    /**
     * Mengambil user tersimpan dari localStorage bila tersedia.
     */
    const restorePersistedUser = (): PersistedUserPayload | null => {
        const stored = localStorage.getItem(PERSISTED_USER_KEY);
        if (!stored) {
            return null;
        }
        try {
            return JSON.parse(stored) as PersistedUserPayload;
        } catch (error) {
            console.warn('Gagal memuat auth_user dari storage:', error);
            localStorage.removeItem(PERSISTED_USER_KEY);
            return null;
        }
    };

    /**
     * Menghapus user tersimpan dari storage ketika logout atau sesi invalid.
     */
    const clearPersistedUser = () => {
        localStorage.removeItem(PERSISTED_USER_KEY);
    };

    /**
     * Verifikasi token saat aplikasi dimuat
     * Cek apakah user sudah login sebelumnya
     */
    useEffect(() => {
        const checkAuthStatus = async () => {
            const persisted = restorePersistedUser();
            const token = localStorage.getItem('access_token');

            try {
                if (persisted?.mode === 'demo') {
                    setUser(persisted.user);
                    console.log('Memuat akun demo dari storage:', persisted.user.email);
                    return;
                }

                if (!token) {
                    if (persisted?.mode === 'real') {
                        console.warn('Token tidak ditemukan untuk sesi real, membersihkan cache auth.');
                        clearPersistedUser();
                    }
                    setUser(null);
                    return;
                }

                // Verifikasi token dengan server untuk memastikan sesi masih valid
                const userData = await authService.verifyToken();
                setUser(userData);
                persistUser({ mode: 'real', user: userData });
                console.log('User berhasil diverifikasi:', userData);
                console.log('User role:', userData.role);
            } catch (error) {
                // Token tidak valid atau expired
                console.warn('Token tidak valid, user belum login:', error);
                if (error instanceof ApiError && error.status === 401) {
                    clearPersistedUser();
                    setUser(null);
                } else if (persisted?.mode === 'demo') {
                    setUser(persisted.user);
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    useEffect(() => {
        const handleAuthCleared = () => {
            clearPersistedUser();
            setUser(null);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:cleared', handleAuthCleared);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:cleared', handleAuthCleared);
            }
        };
    }, []);

    /**
     * Function untuk login user
     * @param email - Email user
     * @param password - Password user
     */
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await authService.login({ email, password });
            
            // Set user state dari response
            setUser(response.user);
            persistUser({ mode: 'real', user: response.user });
            
            console.log('Login berhasil untuk user:', response.user.email);
        } catch (error) {
            console.error('Login gagal:', error);
            const normalizedEmail = email.trim().toLowerCase();
            const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === normalizedEmail);
            const isDemoCredential = demoAccount && password === DEMO_PASSWORD;

            if (demoAccount && isDemoCredential) {
                const mockUser = createMockUser(demoAccount);
                setUser(mockUser);
                persistUser({ mode: 'demo', user: mockUser });
                console.log('Login menggunakan akun demo:', mockUser.email);
                return;
            }

            throw error; // Re-throw untuk handling di component
        }
    };

    /**
     * Function untuk register user baru
     * @param displayName - Full name user
     * @param email - Email user
     * @param password - Password user
     * @param role - Role user (umkm_owner atau customer)
     */
    const register = async (displayName: string, email: string, password: string, role: 'umkm_owner' | 'customer' = 'customer'): Promise<void> => {
        try {
            const response = await authService.register({
                fullName: displayName,
                email,
                password,
                confirmPassword: password,
                phone: '', // Optional, bisa dikosongkan dulu
                role: role // Role yang dipilih user
            });
            
            // Set user state dari response
            setUser(response.user);
            persistUser({ mode: 'real', user: response.user });
            
            console.log('Registrasi berhasil untuk user:', response.user.email);
        } catch (error) {
            console.error('Registrasi gagal:', error);
            throw error;
        }
    };

    /**
     * Function untuk logout user
     * Membersihkan token dan user state
     */
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
            
            // Clear user state
            setUser(null);
            clearPersistedUser();
            
            console.log('User berhasil logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, still clear local state
            setUser(null);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            clearPersistedUser();
        }
    };

    /**
     * Function untuk update profil user
     * @param userData - Data yang akan diupdate
     */
    const updateProfile = async (userData: Partial<User>): Promise<void> => {
        try {
            const updatedUser = await authService.updateProfile(userData);
            
            // Update user state
            setUser(updatedUser);
            const persisted = restorePersistedUser();
            if (persisted) {
                persistUser({ mode: persisted.mode, user: updatedUser });
            }
            
            console.log('Profil berhasil diupdate');
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    /**
     * Function untuk change password
     * @param currentPassword - Password saat ini
     * @param newPassword - Password baru
     */
    const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
        try {
            await authService.changePassword(currentPassword, newPassword);
            
            console.log('Password berhasil diubah');
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    };

    /**
     * Function untuk request password reset
     * @param email - Email user yang ingin reset password
     */
    const requestPasswordReset = async (email: string): Promise<void> => {
        try {
            await authService.requestPasswordReset(email);
            
            console.log('Email reset password berhasil dikirim');
        } catch (error) {
            console.error('Request password reset error:', error);
            throw error;
        }
    };

    /**
     * Integrasi Google Sign-In menggunakan OAuth backend
     */
    const signInWithGoogle = async (): Promise<void> => {
        if (typeof window === 'undefined') {
            throw new Error('Google Sign-In hanya tersedia di lingkungan browser.');
        }

        const redirect = window.location.origin;
        const response = await api.get<{ url: string; state: string }>('/oauth/google/url', { redirect });

        if (!response.success || !response.data?.url) {
            throw new Error(response.message || 'Gagal menyiapkan autentikasi Google.');
        }

        const authUrl = response.data.url;
        const allowedOrigins = resolveOAuthAllowedOrigins();
        const originSet = new Set(allowedOrigins);
        const storageKey = 'oauth-google-result';

        await new Promise<void>((resolve, reject) => {
            const width = 520;
            const height = 640;
            const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
            const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

            const popup = window.open(
                    authUrl,
                    'kd-google-oauth',
                    `menubar=no,location=no,resizable=no,scrollbars=yes,status=no,noopener=no,noreferrer=no,width=${width},height=${height},left=${left},top=${top}`
                );

            if (!popup) {
                reject(new Error('Popup Google diblokir oleh browser. Izinkan popup lalu coba kembali.'));
                return;
            }

            let finished = false;
            let channel: BroadcastChannel | null = null;

            // Menghapus cache hasil OAuth sebelumnya agar tidak terbaca ulang.
            const clearStoredResult = () => {
                try {
                    sessionStorage.removeItem(storageKey);
                } catch (error) {
                    console.warn('Gagal menghapus sessionStorage OAuth:', error);
                }

                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.warn('Gagal menghapus localStorage OAuth:', error);
                }
            };

            clearStoredResult();

            const cleanup = () => {
                if (finished) {
                    return;
                }
                finished = true;
                window.removeEventListener('message', handleWindowMessage);
                window.removeEventListener('storage', handleStorageEvent);
                if (channel) {
                    try {
                        channel.close();
                    } catch (error) {
                        console.warn('Gagal menutup BroadcastChannel OAuth:', error);
                    }
                }
                if (pollTimer) {
                    window.clearInterval(pollTimer);
                }
                window.clearTimeout(timeoutId);
                clearStoredResult();
            };

            const timeoutId = window.setTimeout(() => {
                cleanup();
                try {
                    popup.close();
                } catch (err) {
                    console.warn('Gagal menutup popup Google saat timeout:', err);
                }
                reject(new Error('Autentikasi Google melebihi batas waktu. Silakan coba lagi.'));
            }, 1000 * 60 * 5);

            const finalizeFromPayload = (data: any) => {
                if (!data || data.type !== 'oauth/google') {
                    return false;
                }

                cleanup();

                try {
                    popup.close();
                } catch (err) {
                    console.warn('Gagal menutup popup Google:', err);
                }

                if (!data.success) {
                    reject(new Error(data.error || 'Autentikasi Google gagal.'));
                    return true;
                }

                const normalizedUser = persistRealSession(data.user, data.token, data.refreshToken);
                console.log('Login Google berhasil untuk user:', normalizedUser.email);
                resolve();
                return true;
            };

            const readPayloadFromSerialized = (serialized: string | null) => {
                if (!serialized) {
                    return null;
                }

                try {
                    const parsed = JSON.parse(serialized);
                    return parsed?.payload ?? parsed;
                } catch (error) {
                    console.warn('Gagal mengurai payload OAuth dari storage:', error);
                    return null;
                }
            };

            // TIDAK menggunakan polling popup.closed karena COOP memblokir akses lintas-origin.
            // Autentikasi bergantung sepenuhnya pada komunikasi postMessage/BroadcastChannel/storage.
            const pollTimer = 0; // Placeholder untuk kompatibilitas cleanup.

            const handleWindowMessage = (event: MessageEvent) => {
                console.log('[OAuth Parent] Menerima postMessage dari origin:', event.origin);
                console.log('[OAuth Parent] Data:', event.data);

                if (!originSet.has(event.origin)) {
                    console.warn('[OAuth Parent] Origin tidak terdaftar, diabaikan. Allowed:', Array.from(originSet));
                    return;
                }

                const payloadHandled = finalizeFromPayload(event.data);
                if (!payloadHandled) {
                    console.warn('[OAuth Parent] Payload postMessage tidak dikenali, menunggu pesan berikutnya.');
                }
            };

            const handleStorageEvent = (event: StorageEvent) => {
                if (event.key !== storageKey || !event.newValue) {
                    return;
                }

                const parsedPayload = readPayloadFromSerialized(event.newValue);
                if (parsedPayload) {
                    finalizeFromPayload(parsedPayload);
                }
            };

            console.log('[OAuth Parent] Mendaftarkan listener postMessage untuk origins:', Array.from(originSet));
            window.addEventListener('message', handleWindowMessage);
            window.addEventListener('storage', handleStorageEvent);

            if ('BroadcastChannel' in window) {
                try {
                    channel = new BroadcastChannel('oauth-google');
                    console.log('[OAuth Parent] BroadcastChannel siap mendengarkan:', 'oauth-google');
                    channel.onmessage = (event) => {
                        console.log('[OAuth Parent] Menerima pesan via BroadcastChannel:', event.data);
                        const payload = event?.data;
                        if (!finalizeFromPayload(payload)) {
                            console.warn('[OAuth Parent] Pesan BroadcastChannel tidak valid.');
                        }
                    };
                } catch (error) {
                    console.warn('[OAuth Parent] Gagal membuat BroadcastChannel OAuth:', error);
                    channel = null;
                }
            }

            const cachedPayload = readPayloadFromSerialized(
                sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey)
            );

            if (cachedPayload) {
                console.log('[OAuth Parent] Menemukan payload tersimpan di storage, memproses...');
                finalizeFromPayload(cachedPayload);
            } else {
                console.log('[OAuth Parent] Tidak ada payload tersimpan, menunggu komunikasi dari popup...');
            }
        });
    };

    /**
     * Function untuk refresh auth state
     * Berguna untuk force refresh user data
     */
    const refreshAuth = async (): Promise<void> => {
        setLoading(true);
        const persisted = restorePersistedUser();

        try {
            if (persisted?.mode === 'demo') {
                setUser(persisted.user);
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                if (persisted?.mode === 'real') {
                    clearPersistedUser();
                    setUser(null);
                }
                return;
            }

            const userData = await authService.verifyToken();
            setUser(userData);
            persistUser({ mode: 'real', user: userData });
        } catch (error) {
            console.warn('Refresh auth failed:', error);
            if (error instanceof ApiError && error.status === 401) {
                clearPersistedUser();
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Provide context value ke seluruh aplikasi
    const contextValue: AuthContextType = {
        user,
        role: user?.role || null, // Add role property for backward compatibility
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        signInWithGoogle,
        refreshAuth,
        // Helper properties
        isAuthenticated: !!user,
        hasRole: (role: User['role']) => user?.role === role,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook untuk menggunakan AuthContext
 * @returns AuthContextType dengan semua auth methods
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
