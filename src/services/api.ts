/**
 * Centralized API Service untuk seluruh aplikasi
 * Menangani semua komunikasi dengan backend API
 */

// API Response interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// API Error class untuk error handling yang lebih baik
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Main API Service Class
 * Menangani semua HTTP requests ke backend
 */
const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'auth_user'];

const clearAuthState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  AUTH_STORAGE_KEYS.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });

  // Emit event agar AuthContext atau listener lain dapat merespons token yang gugur.
  window.dispatchEvent(new CustomEvent('auth:cleared'));
};

class ApiService {
  // Base URL untuk semua API calls (menggunakan Vite proxy)
  private baseURL = '/api';
  
  /**
   * Generic request handler untuk semua HTTP methods
   * @param endpoint - API endpoint (tanpa base URL)
   * @param options - Konfigurasi request (method, headers, body, dll)
   * @returns Promise dengan response data
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Ambil token dari localStorage untuk authentication
    const token = localStorage.getItem('access_token');
    
    // Tentukan apakah body menggunakan FormData agar header Content-Type tidak di-set manual.
    const isFormDataBody = options.body instanceof FormData;

    const normalizedHeaders: Record<string, string> = {};

    if (token) {
      normalizedHeaders.Authorization = `Bearer ${token}`;
    }

    // Salin header tambahan dari options agar konfigurasi custom tetap dihormati.
    if (options.headers) {
      const extraHeaders = options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : Array.isArray(options.headers)
          ? Object.fromEntries(options.headers)
          : options.headers as Record<string, string>;

      Object.assign(normalizedHeaders, extraHeaders);
    }

    // Atur header Content-Type hanya ketika bukan FormData dan belum disetel manual.
    if (!isFormDataBody) {
      const hasContentType = Object.keys(normalizedHeaders).some(
        (key) => key.toLowerCase() === 'content-type'
      );

      if (!hasContentType) {
        normalizedHeaders['Content-Type'] = 'application/json';
      }
    } else {
      // Pastikan header Content-Type dihapus agar fetch menentukan boundary otomatis.
      for (const key of Object.keys(normalizedHeaders)) {
        if (key.toLowerCase() === 'content-type') {
          delete normalizedHeaders[key];
        }
      }
    }

    // Konfigurasi default request dengan header yang sudah dinormalisasi.
    const config: RequestInit = {
      ...options,
      headers: normalizedHeaders,
    };
    
    try {
      // Lakukan HTTP request menggunakan Vite proxy
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Parse response JSON
      let data: ApiResponse<T>;
      try {
        data = await response.json();
      } catch (parseError) {
        // Jika gagal parse JSON, buat response error
        throw new ApiError(
          `Invalid JSON response: ${response.status} ${response.statusText}`,
          response.status
        );
      }
      
      // Check jika response tidak OK (status 4xx atau 5xx)
      if (!response.ok) {
        if (response.status === 401) {
          // Bersihkan cache token saat server menolak otentikasi.
          clearAuthState();
        }
        throw new ApiError(
          data.message || data.error || `HTTP Error: ${response.status}`,
          response.status,
          data
        );
      }
      
      return data;
      
    } catch (error) {
      // Handle network errors
      if (error instanceof ApiError) {
        // Re-throw API errors
        throw error;
      }
      
      // Handle network/fetch errors
      console.error('API Request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new ApiError(
        'Network error. Please check your connection.',
        0
      );
    }
  }
  
  /**
   * HTTP GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Promise dengan response data
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    // Add query parameters if provided
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.request<T>(url, { method: 'GET' });
  }
  
  /**
   * HTTP POST request
   * @param endpoint - API endpoint
   * @param data - Data yang akan dikirim dalam request body
   * @returns Promise dengan response data
   */
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * HTTP PUT request untuk update data
   * @param endpoint - API endpoint
   * @param data - Data yang akan dikirim dalam request body
   * @returns Promise dengan response data
   */
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * HTTP PATCH request untuk partial update
   * @param endpoint - API endpoint
   * @param data - Data yang akan dikirim dalam request body
   * @returns Promise dengan response data
   */
  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * HTTP DELETE request
   * @param endpoint - API endpoint
   * @returns Promise dengan response data
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
  
  /**
   * Upload file dengan FormData
   * @param endpoint - API endpoint
   * @param formData - FormData yang berisi file
   * @returns Promise dengan response data
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('access_token');
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Tidak set Content-Type untuk FormData (browser akan set otomatis)
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }
  
  /**
   * Helper method untuk handle API errors
   * @param error - Error object
   * @returns User-friendly error message
   */
  static getErrorMessage(error: any): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
  }
  
  /**
   * Check if error is authentication error
   * @param error - Error object
   * @returns boolean
   */
  static isAuthError(error: any): boolean {
    return error instanceof ApiError && error.status === 401;
  }
}

// Export singleton instance untuk digunakan di seluruh aplikasi
export const api = new ApiService();

// Export error class and types
export type { ApiResponse };