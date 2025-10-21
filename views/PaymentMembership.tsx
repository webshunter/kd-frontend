import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { View } from '../types';
import { usePayment } from '../src/hooks/usePayment';
import { useAuth } from '../contexts/AuthContext';

// Helper to format currency
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

interface PaymentMembershipProps {
  setCurrentView: (view: View) => void;
}

const PaymentMembership: React.FC<PaymentMembershipProps> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { createPayment, loading, error } = usePayment();

    // Static data for the "UMKM Juara" package
    const selectedPackage = {
        title: "UMKM Juara",
        price: 100000,
        duration: "/ bulan",
    };

    const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'VA' | 'CARD'>('VA');
    const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
    const [uniqueCode] = useState(Math.floor(Math.random() * 900) + 100); // 3-digit unique code
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - 1); // 23:59:59
    const [isPaid, setIsPaid] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);

    useEffect(() => {
        if (isPaid) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [isPaid]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const totalPrice = selectedPackage.price + uniqueCode;

    // Handler untuk proses pembayaran real
    const handleProcessPayment = async () => {
        if (!user) {
            alert('Silakan login terlebih dahulu untuk melakukan pembayaran');
            setCurrentView(View.Login);
            return;
        }

        setIsProcessing(true);

        try {
            // Generate unique order ID
            const orderId = `MEMBERSHIP-${user.id}-${Date.now()}`;

            // Create payment via API
            const result = await createPayment({
                amount: totalPrice,
                paymentMethod: selectedMethod,
                orderId,
                metadata: {
                    packageName: selectedPackage.title,
                    packagePrice: selectedPackage.price,
                    uniqueCode,
                    userId: user.id,
                    userEmail: user.email,
                    userName: user.displayName || user.email,
                },
                successReturnUrl: `${window.location.origin}/?view=dashboard&payment=success`,
                failureReturnUrl: `${window.location.origin}/?view=payment&payment=failed`,
            });

            if (result && result.paymentUrl) {
                setPaymentUrl(result.paymentUrl);
                setCurrentPaymentId(result.paymentId);
                
                // Redirect ke payment gateway
                window.location.href = result.paymentUrl;
            } else {
                alert(error || 'Gagal membuat pembayaran. Silakan coba lagi.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    const bankDetails = {
        bca: { name: "BCA Virtual Account", vaNumber: "8808 1234 5678 9012" },
        mandiri: { name: "Mandiri Virtual Account", vaNumber: "8990 8123 4567 8901" },
        bri: { name: "BRI Virtual Account (BRIVA)", vaNumber: "7770 8123 4567 8901" },
        bni: { name: "BNI Virtual Account", vaNumber: "9880 8123 4567 8901" },
    };

    const PaymentMethodButton = ({ id, icon, label }: { id: 'VA' | 'QRIS' | 'CARD', icon: string, label: string }) => (
        <button
            onClick={() => setSelectedMethod(id)}
            disabled={isProcessing || loading}
            className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${selectedMethod === id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-gray-300 hover:border-blue-400'} ${(isProcessing || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="material-symbols-outlined text-blue-600">{icon}</span>
            <span className="font-semibold text-gray-800">{label}</span>
        </button>
    );

    if (isPaid) {
        return (
            <div className="bg-gray-50 animate-fade-in">
                <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
                    <div className="bg-white p-8 rounded-lg shadow-lg border text-center max-w-lg">
                        <span className="material-symbols-outlined text-6xl text-blue-500">update</span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">Konfirmasi Diterima</h2>
                        <p className="mt-2 text-gray-600">
                            Terima kasih! Kami telah menerima konfirmasi pembayaran Anda. Tim kami akan segera melakukan verifikasi, dan akun membership <strong>{selectedPackage.title}</strong> Anda akan diaktifkan dalam waktu 1x24 jam.
                        </p>
                        <button 
                            onClick={() => setCurrentView(View.Login)}
                            className="w-full mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                            <span className="material-symbols-outlined">login</span>
                            <span>OK, Lanjut ke Halaman Login</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-gray-50 animate-fade-in">
            <div className="container mx-auto px-6 py-12">
                <SectionTitle
                    title="Selesaikan Pembayaran Membership Anda"
                    subtitle="Pilih metode pembayaran yang paling sesuai untuk Anda dan aktifkan paket UMKM Juara."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-lg border">
                        {/* Timer and Total */}
                        <div className="text-center bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                            <p className="font-semibold text-yellow-800">Selesaikan pembayaran dalam</p>
                            <p className="text-4xl font-bold text-yellow-900 tracking-wider">{formatTime(timeLeft)}</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-gray-600">Total Pembayaran</p>
                            <p className="text-4xl font-extrabold text-blue-600">{formatCurrency(totalPrice)}</p>
                            <p className="text-sm text-gray-500 mt-1">Transfer tepat hingga 3 digit terakhir untuk verifikasi otomatis.</p>
                        </div>

                        {/* Payment Methods */}
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Pilih Metode Pembayaran</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <PaymentMethodButton id="VA" icon="account_balance" label="Virtual Account" />
                            <PaymentMethodButton id="QRIS" icon="qr_code_2" label="QRIS (E-Wallet)" />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                                <p className="font-semibold">❌ {error}</p>
                            </div>
                        )}

                        {/* VA Details */}
                        {selectedMethod === 'VA' && (
                            <div className="animate-fade-in">
                                <h4 className="font-semibold text-gray-700 mb-3">Pilih Bank:</h4>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {Object.keys(bankDetails).map(bankKey => (
                                        <button key={bankKey} onClick={() => setSelectedBank(bankKey as any)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedBank === bankKey ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                                            {bankKey.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="font-semibold text-gray-800">{bankDetails[selectedBank].name}</p>
                                    <div className="flex justify-between items-center bg-gray-200 p-3 rounded-md my-2">
                                        <span className="font-mono text-lg tracking-wider text-gray-900">{bankDetails[selectedBank].vaNumber}</span>
                                        <button onClick={() => navigator.clipboard.writeText(bankDetails[selectedBank].vaNumber)} className="text-blue-600 hover:text-blue-800"><span className="material-symbols-outlined">content_copy</span></button>
                                    </div>
                                    <p className="text-xs text-gray-500">Salin nomor di atas dan lakukan pembayaran melalui ATM, m-Banking, atau i-Banking {selectedBank.toUpperCase()} Anda.</p>
                                </div>
                            </div>
                        )}

                        {/* QRIS Details */}
                        {selectedMethod === 'QRIS' && (
                            <div className="text-center animate-fade-in">
                                <p className="font-semibold text-gray-700 mb-3">Setelah klik "Lanjutkan Pembayaran", Anda akan diarahkan ke halaman QRIS.</p>
                                <div className="flex justify-center">
                                    <div className="border-4 border-gray-300 p-8 rounded-lg bg-gray-50">
                                        <span className="material-symbols-outlined text-8xl text-gray-400">qr_code_2</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Didukung oleh: GoPay, OVO, DANA, ShopeePay, LinkAja, dan lainnya.</p>
                            </div>
                        )}

                        {/* Info Payment Gateway */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <span className="material-symbols-outlined text-blue-600">info</span>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Informasi Pembayaran</p>
                                    <p>Setelah klik tombol "Lanjutkan Pembayaran", Anda akan diarahkan ke halaman pembayaran <strong>Pivot Payment Gateway</strong> yang aman dan terpercaya. Ikuti instruksi di halaman tersebut untuk menyelesaikan pembayaran.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right/Sidebar Column */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Ringkasan Pesanan</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Paket Membership</span>
                                    <span className="font-semibold text-gray-800">{selectedPackage.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Harga Paket</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(selectedPackage.price)} {selectedPackage.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Kode Unik</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(uniqueCode)}</span>
                                </div>
                                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                                    <span>Total Pembayaran</span>
                                    <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>
                            
                            {/* Info untuk user yang belum login */}
                            {!user && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Silakan login terlebih dahulu untuk melakukan pembayaran
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={handleProcessPayment}
                                disabled={isProcessing || loading || !user}
                                className={`w-full mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 ${(isProcessing || loading || !user) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {(isProcessing || loading) ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">payment</span>
                                        <span>Lanjutkan Pembayaran</span>
                                    </>
                                )}
                            </button>

                            {/* Tombol alternatif untuk demo/testing */}
                            <button 
                                onClick={() => setIsPaid(true)}
                                className="w-full mt-3 bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span>Demo: Tandai Sudah Bayar</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PaymentMembership;