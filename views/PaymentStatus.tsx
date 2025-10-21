/**
 * Payment Status View
 * Halaman untuk cek dan monitoring status pembayaran
 */

import React, { useState, useEffect } from 'react';
import { usePayment } from '../src/hooks/usePayment';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../src/services/paymentService';

interface PaymentStatusProps {
  onBack: () => void;
  initialPaymentId?: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ onBack, initialPaymentId }) => {
  const { user } = useAuth();
  const { loading, error, paymentData, checkPaymentStatus } = usePayment();
  
  const [paymentId, setPaymentId] = useState<string>(initialPaymentId || '');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(0);

  // Ambil paymentId dari props jika ada
  useEffect(() => {
    if (initialPaymentId) {
      setPaymentId(initialPaymentId);
      handleCheckStatus(initialPaymentId);
    }
  }, [initialPaymentId]);

  // Auto-refresh timer untuk pending payments
  useEffect(() => {
    if (autoRefresh && paymentData?.status === 'pending') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Refresh status
            if (paymentId) {
              checkPaymentStatus(parseInt(paymentId));
            }
            return 10; // Reset ke 10 detik
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoRefresh, paymentData?.status, paymentId]);

  // Expiry countdown timer
  useEffect(() => {
    if (paymentData?.status === 'pending' && paymentData.expires_at) {
      const timer = setInterval(() => {
        const remaining = paymentService.getExpiryTime(paymentData.expires_at || '');
        setExpiryCountdown(remaining);
        
        if (remaining <= 0) {
          // Payment expired, refresh status
          if (paymentId) {
            checkPaymentStatus(parseInt(paymentId));
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentData]);

  // Handler untuk cek status
  const handleCheckStatus = async (id?: string) => {
    const targetId = id || paymentId;
    if (!targetId) {
      alert('Masukkan ID pembayaran');
      return;
    }

    const result = await checkPaymentStatus(parseInt(targetId));
    if (result && result.status === 'pending') {
      setAutoRefresh(true);
      setCountdown(10);
    } else {
      setAutoRefresh(false);
    }
  };

  // Handler untuk buka payment URL
  const handleOpenPaymentUrl = () => {
    if (paymentData?.payment_url) {
      window.open(paymentData.payment_url, '_blank');
    }
  };

  // Status icon dan color
  const getStatusIcon = (status: string) => {
    const icons: Record<string, { icon: string; color: string }> = {
      pending: { icon: 'schedule', color: 'text-yellow-500' },
      success: { icon: 'check_circle', color: 'text-green-500' },
      failed: { icon: 'cancel', color: 'text-red-500' },
      expired: { icon: 'timer_off', color: 'text-gray-500' },
      cancelled: { icon: 'block', color: 'text-gray-500' },
    };
    return icons[status] || { icon: 'help', color: 'text-gray-500' };
  };

  const statusIcon = paymentData ? getStatusIcon(paymentData.status) : null;
  const statusLabel = paymentData ? paymentService.getStatusLabel(paymentData.status) : null;

  // Redirect jika belum login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-orange-500 mb-4">lock</span>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Login Diperlukan</h2>
          <p className="text-gray-600 mb-6">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Status Pembayaran</h1>
              <p className="text-orange-100">Cek status pembayaran Anda secara real-time</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cek Status Pembayaran</h2>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Pembayaran
                </label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Masukkan ID pembayaran"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCheckStatus();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => handleCheckStatus()}
                  disabled={loading || !paymentId}
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Mengecek...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">search</span>
                      Cek Status
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Payment Status Card */}
          {paymentData && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              
              {/* Status Header */}
              <div className={`p-8 ${
                paymentData.status === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                paymentData.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                paymentData.status === 'failed' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                'bg-gradient-to-r from-gray-500 to-gray-600'
              } text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-6xl ${statusIcon?.color}`} style={{ fontSize: '72px' }}>
                      {statusIcon?.icon}
                    </span>
                    <div>
                      <h3 className="text-3xl font-bold">{statusLabel?.label}</h3>
                      <p className="text-white/80 mt-1">Status Pembayaran</p>
                    </div>
                  </div>
                  
                  {paymentData.status === 'pending' && (
                    <div className="text-right">
                      <p className="text-sm text-white/80 mb-1">Kadaluarsa dalam</p>
                      <p className="text-3xl font-mono font-bold">
                        {paymentService.formatTimeCountdown(expiryCountdown)}
                      </p>
                    </div>
                  )}
                </div>

                {paymentData.status === 'pending' && (
                  <div className="mt-4 p-4 bg-white/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        <span>Auto-refresh aktif • Mengecek ulang dalam {countdown}s</span>
                      </div>
                      <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-lg transition"
                      >
                        {autoRefresh ? 'Matikan' : 'Aktifkan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="p-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Detail Pembayaran</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Pembayaran</p>
                    <p className="font-semibold text-gray-800">#{paymentData.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Pesanan</p>
                    <p className="font-semibold text-gray-800">{paymentData.order_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jumlah</p>
                    <p className="font-semibold text-gray-800 text-xl">
                      {paymentService.formatCurrency(paymentData.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Metode Pembayaran</p>
                    <p className="font-semibold text-gray-800">
                      {paymentService.getPaymentMethodLabel(paymentData.payment_method)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dibuat</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(paymentData.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Terakhir Update</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(paymentData.updated_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                  {paymentData.status === 'pending' && paymentData.payment_url && (
                    <button
                      onClick={handleOpenPaymentUrl}
                      className="flex-1 px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">payment</span>
                      Lanjutkan Pembayaran
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCheckStatus()}
                    disabled={loading}
                    className="px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                    Refresh Status
                  </button>
                  
                  {paymentData.status === 'success' && (
                    <button
                      onClick={onBack}
                      className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      Selesai
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="p-8 bg-gray-50 border-t">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Timeline</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Pembayaran Dibuat</p>
                      <p className="text-sm text-gray-500">
                        {new Date(paymentData.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  {paymentData.status !== 'pending' && (
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        paymentData.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {statusLabel?.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(paymentData.updated_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          {!paymentData && !loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-500 text-3xl">info</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Cara Cek Status Pembayaran</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Masukkan ID pembayaran yang Anda terima saat membuat transaksi</li>
                    <li>• Klik tombol "Cek Status" untuk melihat status terkini</li>
                    <li>• Status akan di-refresh otomatis jika pembayaran masih pending</li>
                    <li>• Anda bisa menemukan ID pembayaran di email konfirmasi atau dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
