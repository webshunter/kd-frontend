/**
 * usePayment Hook
 * Custom hook untuk menangani payment operations
 */

import { useState, useCallback } from 'react';
import paymentService, { CreatePaymentRequest, PaymentStatus } from '../services/paymentService';

export interface UsePaymentReturn {
  // State
  loading: boolean;
  error: string | null;
  paymentData: PaymentStatus | null;
  
  // Methods
  createPayment: (data: CreatePaymentRequest) => Promise<{ paymentId: number; paymentUrl: string } | null>;
  checkPaymentStatus: (paymentId: number) => Promise<PaymentStatus | null>;
  resetError: () => void;
}

/**
 * Hook untuk payment operations
 */
export const usePayment = (): UsePaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentStatus | null>(null);

  /**
   * Buat payment baru
   */
  const createPayment = useCallback(async (data: CreatePaymentRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentService.createPayment(data);
      
      if (response.success) {
        return {
          paymentId: response.data.paymentId,
          paymentUrl: response.data.paymentUrl,
        };
      } else {
        setError(response.message || 'Gagal membuat pembayaran');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat membuat pembayaran';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cek status payment
   */
  const checkPaymentStatus = useCallback(async (paymentId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentService.getPaymentStatus(paymentId);
      
      if (response.success) {
        setPaymentData(response.data);
        return response.data;
      } else {
        setError('Gagal mengecek status pembayaran');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengecek status';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    paymentData,
    createPayment,
    checkPaymentStatus,
    resetError,
  };
};

export default usePayment;
