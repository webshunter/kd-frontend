import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, UMKMProfile } from '../types';
import { MOCK_UMKM_DATA, UMKM_CATEGORIES } from '../constants';
import SectionTitle from '../components/SectionTitle';
import { firebaseConfig } from '../services/firebase';
import { calculateReadinessScore, SCORE_MAP, MAX_SCORES, LABELS, DESCRIPTIONS } from '../utils/umkmUtils';
import UMKMLeaderboard from '../components/UMKMLeaderboard';

declare global {
  interface Window { Recharts: any; }
}

// FIX: Create a correct union type for all possible metric values.
// `keyof (A | B)` results in an intersection of keys (`keyof A & keyof B`), which was `never` in this case.
// This new type correctly creates a union of all possible keys (`keyof A | keyof B`).
type AllMetricValues = { [K in keyof typeof SCORE_MAP]: keyof typeof SCORE_MAP[K] }[keyof typeof SCORE_MAP];

// --- Readiness Indicator Component (used in detail view) ---
const ReadinessIndicator: React.FC<{ title: string; metric: keyof typeof SCORE_MAP; value: AllMetricValues | undefined; isAnimating: boolean; animationDelay?: string }> = ({ title, metric, value, isAnimating, animationDelay = '0s' }) => {
    const validValue = value || 'none';
    // @ts-ignore
    const score = SCORE_MAP[metric][validValue] || 0;
    const maxScore = MAX_SCORES[metric as keyof typeof MAX_SCORES];
    const percentage = (score / maxScore) * 100;
    // @ts-ignore
    const label = LABELS[metric][validValue] || "N/A";
    // @ts-ignore
    const description = DESCRIPTIONS[metric][validValue] || "";
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-gray-700 text-sm">{title}</p>
                <p className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{label}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: isAnimating ? `${percentage}%` : '0%',
                    transitionDelay: animationDelay,
                  }}
                ></div>
            </div>
             {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
    );
};


// --- Chart Component ---
const ReadinessChart: React.FC<{ data: { name: string; jumlah: number; fill: string; }[] }> = ({ data }) => {
    if (!window.Recharts) {
        return <div className="text-center p-8 bg-gray-100 rounded-lg">Memuat grafik...</div>;
    }
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = window.Recharts;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Distribusi Kesiapan Digital UMKM</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                    <Bar dataKey="jumlah" name="Jumlah UMKM">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Child Components ---

const UMKMCard: React.FC<{ umkm: UMKMProfile; onSelect: (umkm: UMKMProfile) => void }> = ({ umkm, onSelect }) => {
    const score = calculateReadinessScore(umkm);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Animate only once
                }
            },
            { threshold: 0.1 } // Start animation when 10% of the card is visible
        );

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);
    
    const getProgressBarColor = () => {
        if (score >= 75) return 'bg-green-500';
        if (score >= 40) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div ref={cardRef} className="bg-white rounded-lg shadow-md overflow-hidden group border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <div className="overflow-hidden">
                <img src={umkm.image} alt={umkm.businessName} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <p className="font-semibold text-sm text-blue-600">{umkm.category}</p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{umkm.businessName}</h3>
                <p className="text-sm text-gray-500">oleh {umkm.ownerName}</p>
                <p className="text-gray-600 text-sm mt-2 flex-grow">{umkm.description}</p>
                
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-semibold text-gray-600 uppercase">Kesiapan Digital</p>
                        <p className="text-sm font-bold text-gray-800">{score}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${getProgressBarColor()} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: isVisible ? `${score}%` : '0%' }}></div>
                    </div>
                </div>

                <button
                    onClick={() => onSelect(umkm)}
                    className="mt-4 w-full bg-blue-50 text-blue-700 font-bold py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300 flex-shrink-0"
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
};


const UMKMDetailView: React.FC<{ umkm: UMKMProfile; onBack: () => void }> = ({ umkm, onBack }) => {
    const [animateProgress, setAnimateProgress] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateProgress(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${umkm.image}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 -mt-16 relative z-10">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <button onClick={onBack} className="absolute top-4 left-4 flex items-center text-white bg-black/40 hover:bg-black/70 rounded-full px-3 py-1 text-sm font-semibold">
                        <span className="material-symbols-outlined mr-1 !text-base">arrow_back</span>
                        Kembali
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end">
                        <div className="md:w-3/4">
                             <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                                {umkm.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{umkm.businessName}</h1>
                            <p className="text-lg text-gray-600">oleh {umkm.ownerName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tentang Usaha</h3>
                            <p className="text-gray-700 whitespace-pre-line">{umkm.fullDescription || umkm.description}</p>
                         </div>
                         
                         {umkm.gallery && umkm.gallery.length > 0 && (
                            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Galeri</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {umkm.gallery.map((img, index) => (
                                        <img key={index} src={img} alt={`Galeri ${index+1}`} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                                    ))}
                                </div>
                            </div>
                         )}

                         {umkm.coordinates && (
                            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Lokasi</h3>
                                <div className="h-80 rounded-lg overflow-hidden border">
                                     <iframe
                                        title={`Lokasi ${umkm.businessName}`}
                                        width="100%"
                                        height="100%"
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://www.google.com/maps/embed/v1/place?key=${firebaseConfig.apiKey}&q=${umkm.coordinates.lat},${umkm.coordinates.lng}`}>
                                    </iframe>
                                </div>
                            </div>
                         )}
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                         <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">Informasi Kontak</h3>
                                {umkm.address && <p className="flex items-start text-sm"><span className="material-symbols-outlined text-gray-500 mr-3">location_on</span>{umkm.address}</p>}
                                {umkm.contact?.phone && <p className="flex items-start text-sm"><span className="material-symbols-outlined text-gray-500 mr-3">phone</span>{umkm.contact.phone}</p>}
                                {umkm.contact?.email && <p className="flex items-start text-sm"><span className="material-symbols-outlined text-gray-500 mr-3">mail</span><a href={`mailto:${umkm.contact.email}`} className="text-blue-600 hover:underline">{umkm.contact.email}</a></p>}
                                {umkm.contact?.website && <p className="flex items-start text-sm"><span className="material-symbols-outlined text-gray-500 mr-3">language</span><a href={umkm.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{umkm.contact.website}</a></p>}
                                {umkm.socialMedia?.instagram && (
                                    <p className="flex items-start text-sm">
                                        <span className="text-gray-500 mr-3">
                                            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6.406-1.185a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
                                        </span>
                                        <a href={`https://instagram.com/${umkm.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@{umkm.socialMedia.instagram}</a>
                                    </p>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                 <h3 className="text-lg font-bold text-gray-800 mb-2">Kesiapan Digital</h3>
                                 <div className="space-y-4">
                                     <ReadinessIndicator title="Pencatatan Keuangan" metric="financialRecording" value={umkm.financialRecording} isAnimating={animateProgress} animationDelay="0.1s" />
                                     <ReadinessIndicator title="Kemasan Produk" metric="productPackaging" value={umkm.productPackaging} isAnimating={animateProgress} animationDelay="0.2s" />
                                     <ReadinessIndicator title="Pembayaran Digital" metric="digitalPaymentAdoption" value={umkm.digitalPaymentAdoption} isAnimating={animateProgress} animationDelay="0.3s" />
                                     <ReadinessIndicator title="Kehadiran Online" metric="onlinePresence" value={umkm.onlinePresence} isAnimating={animateProgress} animationDelay="0.4s" />
                                 </div>
                            </div>

                            {umkm.tangselMartLink && (
                                <div className="border-t pt-4">
                                    <a href={umkm.tangselMartLink} className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300 flex items-center justify-center space-x-2 text-sm">
                                        <span className="material-symbols-outlined">shopping_basket</span>
                                        <span>Lihat di TangselMart</span>
                                    </a>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---
interface UMKMProps {
  setCurrentView: (view: View) => void;
}

const UMKM: React.FC<UMKMProps> = ({ setCurrentView }) => {
    const [searchInput, setSearchInput] = useState('');
    const [activeSearchQuery, setActiveSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<UMKMProfile['category'] | 'Semua'>('Semua');
    const [selectedUmkm, setSelectedUmkm] = useState<UMKMProfile | null>(null);

    const readinessData = useMemo(() => {
        const readinessCounts = {
            Rendah: 0,
            Menengah: 0,
            Tinggi: 0,
        };

        MOCK_UMKM_DATA.forEach(umkm => {
            const score = calculateReadinessScore(umkm);
            if (score < 40) {
                readinessCounts.Rendah++;
            } else if (score < 75) {
                readinessCounts.Menengah++;
            } else {
                readinessCounts.Tinggi++;
            }
        });

        return [
            { name: 'Rendah (<40%)', jumlah: readinessCounts.Rendah, fill: '#ef4444' },
            { name: 'Menengah (40-74%)', jumlah: readinessCounts.Menengah, fill: '#f59e0b' },
            { name: 'Tinggi (>=75%)', jumlah: readinessCounts.Tinggi, fill: '#22c55e' },
        ];
    }, []);

    const filteredData = useMemo(() => {
        return MOCK_UMKM_DATA.filter(umkm => {
            const matchesCategory = categoryFilter === 'Semua' || umkm.category === categoryFilter;
            const lowercasedQuery = activeSearchQuery.toLowerCase();
            const matchesSearch = umkm.businessName.toLowerCase().includes(lowercasedQuery) || 
                                  umkm.description.toLowerCase().includes(lowercasedQuery) ||
                                  umkm.ownerName.toLowerCase().includes(lowercasedQuery);
            return matchesCategory && matchesSearch;
        });
    }, [activeSearchQuery, categoryFilter]);

    const handleSelectUmkm = (umkm: UMKMProfile) => {
        setSelectedUmkm(umkm);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleBackToList = () => setSelectedUmkm(null);

    const handleSearch = () => {
        setActiveSearchQuery(searchInput);
    };

    if (selectedUmkm) {
        return <UMKMDetailView umkm={selectedUmkm} onBack={handleBackToList} />;
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle 
                title="Direktori UMKM Tangerang Selatan"
                subtitle="Jelajahi, temukan, dan dukung berbagai usaha mikro, kecil, dan menengah yang menjadi tulang punggung ekonomi lokal."
            />
            
            <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 min-h-[20rem]">
                    <ReadinessChart data={readinessData} />
                </div>
                <div className="lg:col-span-1">
                    <UMKMLeaderboard onSelect={handleSelectUmkm} />
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border sticky top-[80px] z-20 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2 relative">
                        <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">search</span>
                        <input
                            type="text"
                            placeholder="Cari nama usaha, pemilik, atau produk..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {UMKM_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 flex items-center space-x-2 transition-colors duration-300"
                    >
                        <span className="material-symbols-outlined">search</span>
                        <span>Cari UMKM</span>
                    </button>
                </div>
            </div>

            <p className="text-gray-600 mb-6">
                Menampilkan <span className="font-bold text-gray-800">{filteredData.length}</span> dari <span className="font-bold text-gray-800">{MOCK_UMKM_DATA.length}</span> UMKM.
            </p>

            {filteredData.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredData.map(umkm => (
                        <UMKMCard key={umkm.id} umkm={umkm} onSelect={handleSelectUmkm} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border">
                    <span className="material-symbols-outlined text-6xl text-gray-400">search_off</span>
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">UMKM Tidak Ditemukan</h3>
                    <p className="text-gray-500 mt-2">Coba ubah kata kunci pencarian atau filter Anda.</p>
                </div>
            )}
        </div>
    );
};

export default UMKM;