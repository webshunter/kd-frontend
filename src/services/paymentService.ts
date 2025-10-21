/**
 * Payment Service
 * Service untuk menangani API calls terkait payment gateway
 */

import { api } from './api';

export interface CreatePaymentRequest {
  amount: number;
  paymentMethod: 'CARD' | 'QRIS' | 'VA';
  orderId: string;
  metadata?: Record<string, any>;
  successReturnUrl?: string;
  failureReturnUrl?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data: {
    paymentId: number;
    paymentUrl: string;
    status: string;
    expiresAt: string;
  };
  message?: string;
}

export interface PaymentStatus {
  id: number;
  order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'expired' | 'cancelled';
  payment_method: string;
  payment_provider_id: string;
  payment_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at?: string | null; // Tambahan untuk expiry time
}

export interface PaymentStatusResponse {
  success: boolean;
  data: PaymentStatus;
}

export interface UserPayment {
  id: number;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_url: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface UserPaymentsResponse {
  success: boolean;
  data: UserPayment[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * Service untuk payment operations
 */
export const paymentService = {
  /**
   * Membuat payment baru
   */
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    try {
      const response = await api.post('/payments/create', data);
      return response as CreatePaymentResponse;
    } catch (error: any) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Cek status payment
   */
  getPaymentStatus: async (paymentId: number): Promise<PaymentStatusResponse> => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return response as PaymentStatusResponse;
    } catch (error: any) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  /**
   * Ambil daftar payment user
   */
  getUserPayments: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<UserPaymentsResponse> => {
    try {
      const response = await api.get('/payments/user', { params });
      return response as UserPaymentsResponse;
    } catch (error: any) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  },

  /**
   * Helper untuk format currency
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Helper untuk format payment method label
   */
  getPaymentMethodLabel: (method: string): string => {
    const labels: Record<string, string> = {
      CARD: 'Kartu Kredit/Debit',
      QRIS: 'QRIS',
      VA: 'Virtual Account',
    };
    return labels[method] || method;
  },

  /**
   * Helper untuk format status label
   */
  getStatusLabel: (status: string): { label: string; color: string } => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Menunggu Pembayaran', color: 'yellow' },
      success: { label: 'Berhasil', color: 'green' },
      failed: { label: 'Gagal', color: 'red' },
      expired: { label: 'Kadaluarsa', color: 'gray' },
      cancelled: { label: 'Dibatalkan', color: 'gray' },
    };
    return statusMap[status] || { label: status, color: 'gray' };
  },

  /**
   * Helper untuk calculate expiry time
   */
  getExpiryTime: (expiresAt: string): number => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / 1000)); // seconds
  },

  /**
   * Helper untuk format time countdown
   */
  formatTimeCountdown: (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  },

  /**
   * Cek status membership premium user
   */
  getMembershipStatus: async (): Promise<MembershipStatusResponse> => {
    try {
      const response = await api.get('/payments/membership/status');
      // Backend returns direct object, not wrapped in 'data'
      // Response structure: { hasActiveMembership, membership }
      return response as any as MembershipStatusResponse;
    } catch (error: any) {
      console.error('Error getting membership status:', error);
      // Return default structure on error
      return {
        hasActiveMembership: false,
        membership: null
      };
    }
  },
};

export interface MembershipInfo {
  id: number;
  packageName: string;
  duration: string;
  price: number;
  features: string[];
  activatedAt: string;
  expiresAt: string;
  isExpired: boolean;
  daysRemaining: number;
}

export interface MembershipStatusResponse {
  hasActiveMembership: boolean;
  membership: MembershipInfo | null;
}

export default paymentService;
