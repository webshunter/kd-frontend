import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../src/services/api';

/**
 * CustomerDashboard - Dashboard khusus untuk customer role
 * Menampilkan:
 * - Welcome message
 * - Order history dengan payment status
 * - Quick actions (lanjutkan belanja, etc)
 */

interface OrderItem {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_id: number | null;
  payment_status: string | null;
  payment_url: string | null;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order history saat component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await api.get('/orders');
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Gagal memuat pesanan');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Format currency
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper: Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper: Get status badge color
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Dibayar', color: 'bg-green-100 text-green-800' },
      processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-800' },
      completed: { label: 'Selesai', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Helper: Get payment status badge
  const getPaymentStatusBadge = (paymentStatus: string | null) => {
    if (!paymentStatus) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <span className="material-symbols-outlined text-xs align-middle mr-1">schedule</span>
          Belum Ada Pembayaran
        </span>
      );
    }

    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
      success: { label: 'Berhasil', color: 'bg-green-100 text-green-700', icon: 'check_circle' },
      failed: { label: 'Gagal', color: 'bg-red-100 text-red-700', icon: 'cancel' },
      expired: { label: 'Kadaluarsa', color: 'bg-gray-100 text-gray-600', icon: 'schedule' },
    };

    const config = statusConfig[paymentStatus] || { 
      label: paymentStatus, 
      color: 'bg-gray-100 text-gray-600', 
      icon: 'help' 
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="material-symbols-outlined text-xs align-middle mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Handle: Bayar sekarang
  const handlePayNow = (order: OrderItem) => {
    if (order.payment_url) {
      window.location.href = order.payment_url;
    } else {
      alert('Link pembayaran tidak tersedia');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Selamat Datang, {user?.email?.split('@')[0] || 'Customer'}! 👋
            </h1>
            <p className="text-blue-100">
              Kelola pesanan Anda dan pantau status pembayaran di sini
            </p>
          </div>
          <div className="hidden md:block">
            <span className="material-symbols-outlined text-6xl opacity-20">shopping_bag</span>
          </div>
        </div>
      </div>

      {/* Order Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Menunggu Pembayaran</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-yellow-500 text-4xl">schedule</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sedang Diproses</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 text-4xl">local_shipping</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Selesai</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="material-symbols-outlined mr-2">receipt_long</span>
            Pesanan Saya
          </h2>
          <button
            onClick={fetchOrders}
            className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
          >
            <span className="material-symbols-outlined text-sm mr-1">refresh</span>
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Memuat pesanan...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-400 text-6xl">shopping_cart</span>
            <p className="text-gray-600 mt-4 text-lg">Belum ada pesanan</p>
            <p className="text-gray-500 text-sm mt-2">
              Mulai belanja di TangselMart untuk melihat pesanan Anda di sini
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.order_number}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                        {formatDate(order.created_at)}
                      </p>
                      <p className="flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">shopping_bag</span>
                        {order.items?.length || 0} item
                      </p>
                      <p className="font-semibold text-blue-600 flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">payments</span>
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {getPaymentStatusBadge(order.payment_status)}
                    
                    {/* Action Button */}
                    {order.status === 'pending' && order.payment_url && order.payment_status !== 'success' && (
                      <button
                        onClick={() => handlePayNow(order)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium"
                      >
                        <span className="material-symbols-outlined text-sm mr-1">payment</span>
                        Bayar Sekarang
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm font-medium">
                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                        Terima Pesanan
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Item pesanan:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {item.quantity}x Produk
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{order.items.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="material-symbols-outlined mr-2">bolt</span>
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 p-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span className="material-symbols-outlined">shopping_basket</span>
            <span className="font-medium">Lanjutkan Belanja</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="font-medium">Bantuan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
