import React, { useState, useMemo, useRef, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useAuth } from '../contexts/AuthContext';
import { KOPERASI_NEWS } from '../constants';
import { CooperativeNews } from '../types';
import NewsCard from '../components/NewsCard';

// --- MOCK DATA ---
const MOCK_MEMBER_DATA = {
    savings: {
        pokok: 100000,
        wajib: 1200000,
        sukarela: 5000000,
    },
    loan: {
        active: true,
        status: 'Aktif' as 'Aktif' | 'Lunas',
        totalLoan: 6600000, // 12 months * 550k
        remaining: 4500000,
        nextDueDate: '2024-07-15',
        monthlyInstallment: 550000,
    }
};

const NEWS_CATEGORIES = ['Semua', 'Pemberdayaan', 'Acara', 'Edukasi'];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });


// --- CHILD COMPONENTS ---

const NewsDetailModal: React.FC<{ article: CooperativeNews | null; onClose: () => void }> = ({ article, onClose }) => {
    if (!article) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-95 animate-scale-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 z-20">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="relative h-64 flex-shrink-0">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <h2 className="text-2xl font-bold text-white">{article.title}</h2>
                        <p className="text-sm text-gray-200">{article.date}</p>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                        {article.fullContent}
                    </div>
                </div>
            </div>
        </div>
    );
};


const MemberDashboard: React.FC<{ name: string }> = ({ name }) => {
    const totalSavings = MOCK_MEMBER_DATA.savings.pokok + MOCK_MEMBER_DATA.savings.wajib + MOCK_MEMBER_DATA.savings.sukarela;
    
    // Loan progress calculation
    const loanPaid = MOCK_MEMBER_DATA.loan.totalLoan - MOCK_MEMBER_DATA.loan.remaining;
    const loanProgress = (loanPaid / MOCK_MEMBER_DATA.loan.totalLoan) * 100;

    return (
        <section className="py-12 bg-blue-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Dasbor Anggota: <span className="text-blue-600">{name}</span></h2>
                <p className="text-gray-600 mb-6">Kelola simpanan dan pinjaman Anda di satu tempat.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Savings Card */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><span className="material-symbols-outlined mr-2 text-green-500">savings</span>Ringkasan Simpanan</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Simpanan Pokok</span> <span className="font-semibold">{formatCurrency(MOCK_MEMBER_DATA.savings.pokok)}</span></div>
                            <div className="flex justify-between"><span>Simpanan Wajib</span> <span className="font-semibold">{formatCurrency(MOCK_MEMBER_DATA.savings.wajib)}</span></div>
                            <div className="flex justify-between"><span>Simpanan Sukarela</span> <span className="font-semibold">{formatCurrency(MOCK_MEMBER_DATA.savings.sukarela)}</span></div>
                        </div>
                        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total Simpanan</span>
                            <span>{formatCurrency(totalSavings)}</span>
                        </div>
                        <button className="w-full mt-4 bg-green-500 text-white font-semibold py-2 rounded-full hover:bg-green-600 transition-colors">Lihat Rincian Simpanan</button>
                    </div>

                    {/* Loan Card */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <span className="material-symbols-outlined mr-2 text-orange-500">payments</span>Status Pinjaman
                            </h3>
                            {MOCK_MEMBER_DATA.loan.active ? (
                                <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                                    {MOCK_MEMBER_DATA.loan.status}
                                </span>
                            ) : (
                                <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    Lunas
                                </span>
                            )}
                        </div>
                         {MOCK_MEMBER_DATA.loan.active ? (
                            <>
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="text-gray-600">Terbayar: {formatCurrency(loanPaid)}</span>
                                        <span className="font-semibold text-gray-800">{loanProgress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${loanProgress}%` }}></div>
                                    </div>
                                    <p className="text-xs text-right text-gray-500 mt-1">Total Pinjaman: {formatCurrency(MOCK_MEMBER_DATA.loan.totalLoan)}</p>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 text-sm border-t pt-4">
                                    <div className="flex justify-between"><span>Sisa Pinjaman</span> <span className="font-semibold">{formatCurrency(MOCK_MEMBER_DATA.loan.remaining)}</span></div>
                                    <div className="flex justify-between"><span>Angsuran / Bulan</span> <span className="font-semibold">{formatCurrency(MOCK_MEMBER_DATA.loan.monthlyInstallment)}</span></div>
                                    <div className="flex justify-between"><span>Jatuh Tempo Berikutnya</span> <span className="font-semibold">{formatDate(MOCK_MEMBER_DATA.loan.nextDueDate)}</span></div>
                                </div>
                                <div className="mt-4">
                                     <button className="w-full mt-4 bg-orange-500 text-white font-semibold py-2 rounded-full hover:bg-orange-600 transition-colors">Lihat Rincian Pinjaman</button>
                                </div>
                            </>
                         ) : (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                                <p className="text-gray-600 mt-2 font-semibold">Selamat!</p>
                                <p className="text-gray-500">Anda tidak memiliki pinjaman aktif.</p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const BenefitCard: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl text-emerald-600">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const StepCard: React.FC<{ step: number; title: string; description: string; icon: string }> = ({ step, title, description, icon }) => (
    <div className="relative pl-16">
        <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg border-2 border-emerald-200">
             <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; image: string; }> = ({ quote, name, role, image }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg border">
        <p className="text-gray-600 italic mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
                <p className="font-bold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    </div>
);


const InteractiveLoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState(10000000);
    const [term, setTerm] = useState(12);
    const [interestRate, setInterestRate] = useState(12); // Annual %

    const monthlyInstallment = useMemo(() => {
        const principal = Number(amount);
        const months = Number(term);
        const annualRate = Number(interestRate);

        if (principal > 0 && months > 0) {
            if (annualRate > 0) {
                const monthlyRate = (annualRate / 100) / 12;
                const powerTerm = Math.pow(1 + monthlyRate, months);
                const installment = principal * (monthlyRate * powerTerm) / (powerTerm - 1);
                return installment;
            } else {
                return principal / months;
            }
        }
        return 0;
    }, [amount, term, interestRate]);

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(Number(e.target.value));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl border-2 border-emerald-200">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Kalkulator Pinjaman Interaktif</h3>
            <div className="space-y-6">
                {/* Amount Input */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Jumlah Pinjaman</label>
                        <span className="text-lg font-semibold text-emerald-700">{formatCurrency(amount)}</span>
                    </div>
                    <input
                        id="amount"
                        type="range"
                        min="1000000"
                        max="100000000"
                        step="1000000"
                        value={amount}
                        onChange={handleSliderChange(setAmount)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {/* Term Input */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="term" className="block text-sm font-medium text-gray-700">Tenor (Jangka Waktu)</label>
                        <span className="text-lg font-semibold text-emerald-700">{term} Bulan</span>
                    </div>
                    <input
                        id="term"
                        type="range"
                        min="6"
                        max="60"
                        step="1"
                        value={term}
                        onChange={handleSliderChange(setTerm)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {/* Interest Rate Input */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Suku Bunga per Tahun</label>
                        <span className="text-lg font-semibold text-emerald-700">{interestRate.toFixed(1)}%</span>
                    </div>
                     <input
                        id="interestRate"
                        type="range"
                        min="5"
                        max="25"
                        step="0.1"
                        value={interestRate}
                        onChange={handleSliderChange(setInterestRate)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
            {/* Results */}
            <div className="mt-8 text-center bg-emerald-50 p-6 rounded-lg">
                <p className="text-lg text-gray-600">Estimasi Angsuran Bulanan</p>
                <p className="text-4xl font-extrabold text-emerald-700">{monthlyInstallment > 0 ? formatCurrency(monthlyInstallment) : 'Rp 0'}</p>
                <p className="text-xs text-gray-500 mt-2">*Perhitungan ini menggunakan metode bunga efektif dan hanya merupakan estimasi.</p>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const Koperasi: React.FC = () => {
    const simulatorRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const [selectedNews, setSelectedNews] = useState<CooperativeNews | null>(null);
    const [activeCategory, setActiveCategory] = useState<(typeof NEWS_CATEGORIES)[number]>('Semua');

    const filteredNews = useMemo(() => {
        if (activeCategory === 'Semua') {
            return KOPERASI_NEWS;
        }
        return KOPERASI_NEWS.filter(news => news.category === activeCategory);
    }, [activeCategory]);


    useEffect(() => {
        if (selectedNews) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedNews]);

    const scrollToSimulator = () => {
        simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative text-white py-20 md:py-32 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1600/900?random=29')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/80 to-teal-600/70"></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-text-fade-in-up">
                    Maju Bersama Koperasi Tangsel Sejahtera
                </h1>
                <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto" style={{ animationDelay: '0.3s' }}>
                    Solusi Keuangan Berbasis Gotong Royong untuk Warga dan UMKM Tangerang Selatan.
                </p>
                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition duration-300 text-lg transform hover:scale-105">
                        Daftar Jadi Anggota
                    </button>
                    <button onClick={scrollToSimulator} className="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-lg transform hover:scale-105">
                        Simulasi Pinjaman
                    </button>
                </div>
            </div>
        </section>

        {/* Member Dashboard (conditionally rendered) */}
        {user && <MemberDashboard name={user.displayName || 'Anggota'} />}

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <SectionTitle 
                    title="Mengapa Bergabung dengan Kami?"
                    subtitle="Koperasi kami dibangun di atas asas kekeluargaan untuk memberikan manfaat maksimal bagi setiap anggota."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    <BenefitCard icon="savings" title="Simpanan Aman" description="Simpanan Anda dijamin aman dan mendapatkan Sisa Hasil Usaha (SHU) yang kompetitif setiap tahunnya." />
                    <BenefitCard icon="payments" title="Pinjaman Mudah" description="Akses pinjaman modal usaha atau kebutuhan mendesak dengan proses yang mudah dan bunga yang lebih ringan." />
                    <BenefitCard icon="groups" title="Asas Kekeluargaan" description="Setiap anggota adalah pemilik. Keputusan diambil bersama untuk kesejahteraan seluruh anggota." />
                    <BenefitCard icon="school" title="Pemberdayaan Anggota" description="Dapatkan akses ke program pelatihan, workshop, dan pendampingan usaha khusus untuk anggota." />
                </div>
            </div>
        </section>

         {/* Loan Simulator Section */}
        <section ref={simulatorRef} className="py-20 bg-white scroll-mt-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <InteractiveLoanCalculator />
            </div>
        </section>

        {/* How to Join Section */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <SectionTitle 
                    title="Cara Mudah Menjadi Anggota"
                    subtitle="Hanya dengan 3 langkah sederhana, Anda bisa menjadi bagian dari keluarga besar Koperasi Tangsel Sejahtera."
                />
                <div className="max-w-3xl mx-auto mt-16 space-y-12 relative">
                    <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-gray-200 -z-10 hidden md:block"></div>
                    <StepCard step={1} icon="edit_document" title="Isi Formulir Pendaftaran" description="Lengkapi formulir pendaftaran online dengan data diri yang valid. Prosesnya cepat dan hanya butuh beberapa menit." />
                    <StepCard step={2} icon="account_balance_wallet" title="Lakukan Setoran Awal" description="Bayar Simpanan Pokok dan Simpanan Wajib pertama melalui transfer bank atau datang langsung ke kantor kami." />
                    <StepCard step={3} icon="verified_user" title="Verifikasi & Aktivasi" description="Tim kami akan memverifikasi data Anda dalam 1-2 hari kerja. Setelah disetujui, Anda resmi menjadi anggota!" />
                </div>
                 <div className="text-center mt-16">
                     <button className="bg-emerald-600 text-white font-bold py-4 px-10 rounded-full hover:bg-emerald-700 transition duration-300 text-lg transform hover:scale-105">
                        Mulai Pendaftaran
                    </button>
                </div>
            </div>
        </section>
        
        {/* Cooperative News Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                 <SectionTitle 
                    title="Kabar Koperasi"
                    subtitle="Ikuti berita dan pengumuman terbaru dari Koperasi Tangsel Sejahtera."
                />

                {/* News Filter */}
                <div className="mb-8 flex justify-center flex-wrap gap-2">
                    {NEWS_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                activeCategory === category
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {filteredNews.map((article, index) => (
                            <NewsCard 
                                key={index}
                                article={article}
                                onReadMoreClick={() => setSelectedNews(article)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700">Tidak Ada Berita</h3>
                        <p className="text-gray-500 mt-1">Tidak ada berita yang ditemukan dalam kategori ini.</p>
                    </div>
                )}
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <SectionTitle 
                    title="Apa Kata Anggota Kami"
                    subtitle="Kisah nyata dari mereka yang telah merasakan manfaat bergabung dengan koperasi."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
                    <TestimonialCard 
                        quote="Pinjaman modal dari koperasi sangat membantu saya mengembangkan usaha Bakso Mas Bejo. Prosesnya tidak berbelit-belit dan bunganya sangat bersahabat. Terima kasih Koperasi Tangsel!"
                        name="Bejo Sutrisno"
                        role="Pemilik UMKM Bakso"
                        image="https://picsum.photos/seed/bejo/100/100"
                    />
                    <TestimonialCard 
                        quote="Sebagai ibu rumah tangga, saya merasa tenang menabung di sini. SHU-nya lebih baik dari bunga bank, dan saya merasa ikut memiliki. Ini benar-benar simpanan dari kita, untuk kita."
                        name="Lestari Indah"
                        role="Anggota, Warga Bintaro"
                        image="https://picsum.photos/seed/lestari/100/100"
                    />
                </div>
            </div>
        </section>
        <NewsDetailModal article={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
};

export default Koperasi;