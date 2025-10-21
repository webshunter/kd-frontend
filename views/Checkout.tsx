/**
 * Checkout Component
 * Halaman checkout untuk customer membeli produk dari UMKM
 * Features: Review cart, input shipping address, pilih payment method, create order + payment
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../src/services/api';
import { View } from '../types';

// Props interface
interface CheckoutProps {
  setCurrentView?: (view: View) => void;
}

// Interface untuk cart item
interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  umkm_name?: string;
}

// Interface untuk shipping address
interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'QRIS' | 'VA' | 'CARD'>('QRIS');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingCost] = useState(15000); // Fixed shipping cost for demo

  // Handle remove item from cart
  const handleRemoveItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update sessionStorage
    if (updatedCart.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      sessionStorage.removeItem('cart');
    }
    
    console.log('🗑️ Item removed from cart:', itemId);
  };

  // Handle update item quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('📝 Quantity updated:', itemId, newQuantity);
  };

  // Handle go back to home
  const handleGoToHome = () => {
    sessionStorage.removeItem('kd-dashboard-view');
    if (setCurrentView) {
      setCurrentView(View.Home);
    } else {
      // Fallback jika setCurrentView tidak tersedia
      sessionStorage.setItem('kd-current-view', View.Home);
      window.location.reload();
    }
  };

  // Handle cancel checkout - clear cart and go back
  const handleCancelCheckout = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan checkout? Keranjang akan dikosongkan.')) {
      sessionStorage.removeItem('cart');
      handleGoToHome();
    }
  };

  // Load cart from sessionStorage
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Transform cart items: ensure product_id exists (use id if product_id not present)
        const transformedCart = parsed.map((item: any) => ({
          id: item.id,
          product_id: item.product_id || item.id, // Use product_id if exists, otherwise use id
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image || item.image_url, // Handle both image and image_url
          umkm_name: item.seller || item.umkm_name // Handle both seller and umkm_name
        }));
        setCartItems(transformedCart);
        console.log('📦 Cart loaded:', transformedCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
        setCartItems([]);
      }
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  // Validate form
  const validateForm = (): boolean => {
    if (!shippingAddress.recipientName.trim()) {
      setError('Nama penerima harus diisi');
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      setError('Nomor telepon harus diisi');
      return false;
    }
    if (!shippingAddress.address.trim()) {
      setError('Alamat lengkap harus diisi');
      return false;
    }
    if (!shippingAddress.city.trim()) {
      setError('Kota/Kabupaten harus diisi');
      return false;
    }
    if (!shippingAddress.postalCode.trim()) {
      setError('Kode pos harus diisi');
      return false;
    }
    if (cartItems.length === 0) {
      setError('Keranjang belanja kosong');
      return false;
    }
    return true;
  };

  // Handle checkout
  const handleCheckout = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.name, // Include name for demo products
          price: item.price // Include price for demo products
        })),
        shippingAddress: {
          recipient: shippingAddress.recipientName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode
        },
        notes: shippingAddress.notes,
        paymentMethod: selectedPaymentMethod,
        ...(selectedPaymentMethod === 'VA' && { selectedBank })
      };

      console.log('📦 Creating order with payment...', orderData);

      // Create order (backend will auto-create payment)
      const response: any = await api.post('/orders', orderData);

      console.log('✅ Order created:', response);

      if (response.success && response.data?.payment?.paymentUrl) {
        // Clear cart
        sessionStorage.removeItem('cart');
        
        // Redirect ke Pivot Payment Gateway
        console.log('🎯 Redirecting to payment gateway...');
        window.location.href = response.data.payment.paymentUrl;
      } else {
        // Order created tapi payment gagal
        setError('Pesanan berhasil dibuat, tapi pembayaran belum tersedia. Silakan hubungi admin.');
        console.error('Payment URL not available:', response);
      }

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Gagal memproses checkout. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <span className="material-symbols-outlined text-6xl text-yellow-500 mb-4">shopping_cart</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang Belanja Kosong</h2>
          <p className="text-gray-600 mb-4">Silakan tambahkan produk ke keranjang terlebih dahulu</p>
          <button
            onClick={handleGoToHome}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center mx-auto"
          >
            <span className="material-symbols-outlined mr-2">home</span>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Cancel Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="material-symbols-outlined mr-2">shopping_cart_checkout</span>
          Checkout
        </h1>
        <button
          onClick={handleCancelCheckout}
          className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined mr-2">cancel</span>
          Batalkan Pesanan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <span className="material-symbols-outlined text-red-500 mr-2">error</span>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cart & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cart Items Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2">inventory_2</span>
              Produk yang Dibeli ({cartItems.length})
            </h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.umkm_name && (
                      <p className="text-sm text-gray-500">Dari: {item.umkm_name}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold text-gray-800">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex items-center text-red-600 hover:text-red-700 text-sm"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-sm mr-1">delete</span>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                      sessionStorage.removeItem('cart');
                      setCartItems([]);
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined mr-2">delete_sweep</span>
                  Kosongkan Keranjang
                </button>
              </div>
            )}
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2">local_shipping</span>
              Alamat Pengiriman
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  value={shippingAddress.recipientName}
                  onChange={(e) => setShippingAddress({...shippingAddress, recipientName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama lengkap penerima"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xx xxxx xxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap *
                </label>
                <textarea
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota/Kabupaten *
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tangerang Selatan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Pos *
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15xxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={shippingAddress.notes}
                  onChange={(e) => setShippingAddress({...shippingAddress, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Patokan lokasi, instruksi khusus, dll"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2">payment</span>
              Metode Pembayaran
            </h2>
            <div className="space-y-3">
              {/* QRIS */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: selectedPaymentMethod === 'QRIS' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QRIS"
                  checked={selectedPaymentMethod === 'QRIS'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as 'QRIS')}
                  className="w-5 h-5 text-blue-500"
                />
                <div className="ml-3 flex-1">
                  <span className="font-semibold text-gray-800">QRIS</span>
                  <p className="text-sm text-gray-500">Bayar dengan scan QR code (Gopay, OVO, Dana, dll)</p>
                </div>
                <span className="material-symbols-outlined text-blue-500">qr_code_scanner</span>
              </label>

              {/* Virtual Account */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: selectedPaymentMethod === 'VA' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VA"
                  checked={selectedPaymentMethod === 'VA'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as 'VA')}
                  className="w-5 h-5 text-blue-500"
                />
                <div className="ml-3 flex-1">
                  <span className="font-semibold text-gray-800">Virtual Account</span>
                  <p className="text-sm text-gray-500">Transfer via ATM/Mobile Banking</p>
                  {selectedPaymentMethod === 'VA' && (
                    <div className="mt-2 flex space-x-2">
                      {['BCA', 'Mandiri', 'BRI', 'BNI'].map(bank => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`px-3 py-1 text-sm rounded ${
                            selectedBank === bank 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="material-symbols-outlined text-blue-500">account_balance</span>
              </label>

              {/* Card */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: selectedPaymentMethod === 'CARD' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={selectedPaymentMethod === 'CARD'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as 'CARD')}
                  className="w-5 h-5 text-blue-500"
                />
                <div className="ml-3 flex-1">
                  <span className="font-semibold text-gray-800">Kartu Kredit/Debit</span>
                  <p className="text-sm text-gray-500">Visa, Mastercard, JCB</p>
                </div>
                <span className="material-symbols-outlined text-blue-500">credit_card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} produk)</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                loading || cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  <span>Bayar Sekarang</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
