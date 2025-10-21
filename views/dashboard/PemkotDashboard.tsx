

import React, { useEffect, useState, useRef } from 'react';
import { MOCK_UMKM_DATA } from '../../constants';
import { UMKMProfile, DashboardView } from '../../types';

// Re-use readiness score logic
const SCORE_MAP = {
    financialRecording: { none: 0, manual: 1, spreadsheet: 2, app: 3 },
    productPackaging: { basic: 0, labeled: 1, professional: 2, irrelevant: 2 },
    digitalPaymentAdoption: { cash_only: 0, transfer: 1, ewallet: 2, qris: 3 },
    onlinePresence: { none: 0, social_media: 1, marketplace: 2, website: 3 },
};
const MAX_SCORES = {
    financialRecording: 3,
    productPackaging: 2,
    digitalPaymentAdoption: 3,
    onlinePresence: 3,
};
const calculateReadinessScore = (umkm: UMKMProfile) => {
    const totalScore = 
        (SCORE_MAP.financialRecording[umkm.financialRecording || 'none']) +
        (SCORE_MAP.productPackaging[umkm.productPackaging || 'basic']) +
        (SCORE_MAP.digitalPaymentAdoption[umkm.digitalPaymentAdoption || 'cash_only']) +
        (SCORE_MAP.onlinePresence[umkm.onlinePresence || 'none']);
    
    const maxScore = Object.values(MAX_SCORES).reduce((acc, val) => acc + val, 0);
    return Math.round((totalScore / maxScore) * 100);
};

// Stat Card with counting animation
const StatCard: React.FC<{ icon: string; endValue: number; label: string; suffix?: string; onClick?: () => void }> = ({ icon, endValue, label, suffix = '', onClick }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const duration = 1500;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const startTime = Date.now();
                    const frame = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);
                        const currentVal = Math.floor(progress * endValue);
                        setCount(currentVal);
                        if (progress < 1) {
                            requestAnimationFrame(frame);
                        } else {
                            setCount(endValue);
                        }
                    };
                    requestAnimationFrame(frame);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, [endValue]);

    const formattedCount = new Intl.NumberFormat('id-ID').format(count);

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={`bg-white p-6 rounded-lg shadow-lg border flex flex-col items-center text-center ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform duration-300' : ''}`}
        >
            <div className="text-blue-600 mb-2">
                <span className="material-symbols-outlined text-5xl">{icon}</span>
            </div>
            <p className="text-4xl font-extrabold text-gray-800">{formattedCount}{suffix}</p>
            <p className="text-gray-500 mt-1">{label}</p>
        </div>
    );
};


interface PemkotDashboardProps {
    setActiveDashboardView: (view: DashboardView) => void;
}

const PemkotDashboard: React.FC<PemkotDashboardProps> = ({ setActiveDashboardView }) => {

    const aggregateStats = React.useMemo(() => {
        const totalUMKM = MOCK_UMKM_DATA.length;
        const totalReadinessScore = MOCK_UMKM_DATA.reduce((acc, umkm) => acc + calculateReadinessScore(umkm), 0);
        const averageReadiness = totalUMKM > 0 ? Math.round(totalReadinessScore / totalUMKM) : 0;
        
        const categoryCounts = MOCK_UMKM_DATA.reduce((acc, umkm) => {
            acc[umkm.category] = (acc[umkm.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommonCategory = Object.keys(categoryCounts).length > 0
            ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
            : 'N/A';

        return {
            totalUMKM,
            averageReadiness,
            newRegistrations: 3, // Mock data
            mostCommonCategory,
        };
    }, []);


    return (
        <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon="storefront" 
                    endValue={aggregateStats.totalUMKM} 
                    label="Total UMKM Terdaftar" 
                    onClick={() => setActiveDashboardView(DashboardView.ManageUMKM)}
                />
                <StatCard 
                    icon="leaderboard" 
                    endValue={aggregateStats.averageReadiness} 
                    label="Rata-rata Kesiapan Digital"
                    suffix="%"
                />
                <StatCard 
                    icon="group_add" 
                    endValue={aggregateStats.newRegistrations} 
                    label="Pendaftar Baru (7 Hari)"
                />
                <StatCard 
                    icon="category" 
                    endValue={aggregateStats.mostCommonCategory.length} // Just for animation, display text below
                    label={`Kategori Terbanyak: ${aggregateStats.mostCommonCategory}`}
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pintasan Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button 
                    onClick={() => setActiveDashboardView(DashboardView.ManageUMKM)}
                        className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 text-left"
                    >
                        <span className="material-symbols-outlined text-blue-600">manage_accounts</span>
                        <h3 className="font-bold text-gray-800 mt-2">Manajemen UMKM</h3>
                        <p className="text-sm text-gray-600">Lihat, urutkan, dan kelola semua UMKM yang terdaftar.</p>
                    </button>
                    <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 text-left">
                        <span className="material-symbols-outlined text-green-600">analytics</span>
                        <h3 className="font-bold text-gray-800 mt-2">Laporan & Analitik</h3>
                        <p className="text-sm text-gray-600">Akses laporan pertumbuhan dan data agregat (segera hadir).</p>
                    </button>
                    <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 border border-orange-200 text-left">
                        <span className="material-symbols-outlined text-orange-600">campaign</span>
                        <h3 className="font-bold text-gray-800 mt-2">Publikasi Berita/Acara</h3>
                        <p className="text-sm text-gray-600">Buat dan publikasikan pengumuman untuk warga (segera hadir).</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PemkotDashboard;