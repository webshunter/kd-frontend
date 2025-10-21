import React, { useState } from 'react';

interface ReadinessGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AccordionItemProps {
    title: string;
    icon: string;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100"
            >
                <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-blue-600">{icon}</span>
                    <span>{title}</span>
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 border-t text-sm text-gray-600 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ReadinessGuideModal: React.FC<ReadinessGuideModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="material-symbols-outlined text-blue-600">quiz</span>
                        <h2 className="text-xl font-bold text-gray-800">Panduan Kesiapan Digital</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
                    <AccordionItem title="Pencatatan Keuangan" icon="receipt_long">
                        <p className="font-semibold text-gray-800">Mengapa ini penting?</p>
                        <p>Pencatatan keuangan yang baik membantu Anda memahami arus kas, menghitung laba-rugi secara akurat, dan membuat keputusan bisnis yang lebih baik berdasarkan data, bukan perasaan.</p>
                        
                        <p className="font-semibold text-gray-800 mt-4">Tips Peningkatan:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-gray-700">Mulai dari yang Sederhana:</strong> Jika belum pernah, mulailah dengan buku kas harian untuk mencatat semua pemasukan dan pengeluaran, sekecil apapun.</li>
                            <li><strong className="text-gray-700">Gunakan Spreadsheet:</strong> Manfaatkan template gratis di Google Sheets atau Microsoft Excel untuk membuat laporan laba-rugi sederhana. Ini lebih rapi dan mudah dihitung.</li>
                            <li><strong className="text-gray-700">Coba Aplikasi Kasir (POS):</strong> Banyak aplikasi kasir gratis atau terjangkau (misal: Qasir, Moka, Pawoon) yang otomatis mencatat penjualan dan membuat laporan.</li>
                        </ul>
                    </AccordionItem>
                     <AccordionItem title="Kemasan Produk" icon="inventory_2">
                        <p className="font-semibold text-gray-800">Mengapa ini penting?</p>
                        <p>Kemasan adalah "wajah" dari produk Anda. Kemasan yang baik tidak hanya melindungi produk tetapi juga meningkatkan nilai jual, memberikan informasi penting, dan membangun citra merek yang kuat.</p>
                        
                        <p className="font-semibold text-gray-800 mt-4">Tips Peningkatan:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-gray-700">Tambahkan Label Merek:</strong> Meski kemasan masih sederhana (misal: plastik biasa), tempelkan stiker dengan logo, nama produk, dan kontak Anda. Ini adalah langkah awal termudah.</li>
                            <li><strong className="text-gray-700">Desain Sendiri dengan Canva:</strong> Gunakan platform desain gratis seperti Canva untuk membuat desain label atau stiker yang terlihat profesional tanpa perlu keahlian desain.</li>
                            <li><strong className="text-gray-700">Cari Percetakan Lokal:</strong> Untuk naik ke level profesional, cari vendor percetakan kemasan di sekitar Tangsel untuk membuat dus, pouch, atau standing pouch kustom.</li>
                        </ul>
                    </AccordionItem>
                     <AccordionItem title="Pembayaran Digital" icon="qr_code_2">
                        <p className="font-semibold text-gray-800">Mengapa ini penting?</p>
                        <p>Menyediakan opsi pembayaran digital mempermudah pelanggan untuk bertransaksi (terutama yang tidak membawa uang tunai), mempercepat proses pembayaran, dan membuat usaha Anda terlihat lebih modern dan terpercaya.</p>
                        
                        <p className="font-semibold text-gray-800 mt-4">Tips Peningkatan:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-gray-700">Buka Rekening Khusus Usaha:</strong> Pisahkan rekening pribadi dan usaha. Ini memudahkan Anda menerima pembayaran via transfer bank dan melacak keuangan.</li>
                            <li><strong className="text-gray-700">Daftar E-Wallet:</strong> Daftarkan nomor telepon usaha Anda di aplikasi e-wallet populer seperti GoPay, OVO, dan DANA untuk menerima pembayaran.</li>
                            <li><strong className="text-gray-700">Dapatkan QRIS:</strong> Ini adalah langkah terbaik. Daftar untuk mendapatkan QRIS melalui bank atau penyedia layanan (GoBiz, OVO Merchant, dll). Satu kode QR untuk semua pembayaran. Prosesnya kini semakin mudah dan cepat.</li>
                        </ul>
                    </AccordionItem>
                     <AccordionItem title="Kehadiran Online" icon="public">
                        <p className="font-semibold text-gray-800">Mengapa ini penting?</p>
                        <p>Di era digital, calon pelanggan mencari produk dan jasa secara online. Memiliki kehadiran online membantu Anda menjangkau pasar yang lebih luas, membangun komunitas, dan berinteraksi langsung dengan pelanggan.</p>
                        
                        <p className="font-semibold text-gray-800 mt-4">Tips Peningkatan:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-gray-700">Manfaatkan Media Sosial:</strong> Buat akun Instagram Business dan/atau Halaman Facebook. Unggah foto produk yang menarik secara rutin, adakan promo, dan berinteraksi dengan pengikut Anda.</li>
                            <li><strong className="text-gray-700">Masuk ke Marketplace:</strong> Daftarkan produk Anda di TangselMart dan marketplace besar lainnya (Tokopedia, Shopee). Ini membuka "cabang" baru untuk usaha Anda secara online.</li>
                            <li><strong className="text-gray-700">Buat Website Sederhana:</strong> Untuk membangun kredibilitas jangka panjang, pertimbangkan membuat website. Anda bisa mulai dengan yang gratis seperti Google Sites atau yang berbiaya rendah seperti Carrd untuk menampilkan profil dan katalog produk.</li>
                        </ul>
                    </AccordionItem>
                </div>
                <div className="p-4 bg-gray-100 border-t text-right">
                     <button onClick={onClose} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700">Mengerti</button>
                </div>
            </div>
        </div>
    );
};

export default ReadinessGuideModal;