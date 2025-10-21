import React, { useEffect, useMemo, useState } from 'react';
import { View, DashboardView } from '../types';
import { DashboardUMKMProfile, DashboardUMKMSummary } from '../src/types/dashboard';
import ReadinessGuideModal from '../components/dashboard/ReadinessGuideModal';
import { useAuth } from '../contexts/AuthContext';
import { calculateReadinessScore, SCORE_MAP, MAX_SCORES, LABELS, DESCRIPTIONS } from '../utils/umkmUtils';
import { umkmService } from '../src/services/umkmService';
import { ApiError } from '../src/services/api';
import paymentService, { MembershipInfo } from '../src/services/paymentService';

declare global {
  interface Window { Recharts: any; }
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

// --- CHART COMPONENTS ---

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle stroke="#e5e7eb" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
            <circle
                stroke="#3b82f6"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeLinecap: 'round' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold fill-gray-700 transform rotate-90 origin-center">
                {`${percentage}%`}
            </text>
        </svg>
    );
};

const MetricProgressBar: React.FC<{ title: string; metric: keyof typeof SCORE_MAP; value: string; }> = ({ title, metric, value }) => {
    // @ts-ignore
    const score = SCORE_MAP[metric][value] || 0;
    const maxScore = MAX_SCORES[metric as keyof typeof MAX_SCORES];
    const percentage = (score / maxScore) * 100;
    // @ts-ignore
    const label = LABELS[metric][value] || "N/A";
    // @ts-ignore
    const description = DESCRIPTIONS[metric][value] || "";

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-700">{title}</p>
                <p className={`text-sm font-medium text-blue-600`}>{label}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>
    );
};

// Komponen kartu statistik mempertahankan ikon di kiri dan teks di kanan seperti pada desain, dengan layout rapi tanpa memotong teks.
const StatCard: React.FC<{ icon: string; title: string; value: string; color: string; }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border flex items-center space-x-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
            <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
        </div>
        <div className="flex-1">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight break-words">{value}</p>
        </div>
    </div>
);


// --- JOURNEY COMPONENTS ---

type MilestoneStatus = 'completed' | 'in-progress' | 'locked';

interface JourneyMilestoneProps {
    icon: string;
    title: string;
    targetOutput: string;
    status: MilestoneStatus;
    isLast: boolean;
}

const JourneyMilestone: React.FC<JourneyMilestoneProps> = ({ icon, title, targetOutput, status, isLast }) => {
    const isCompleted = status === 'completed';
    const isInProgress = status === 'in-progress';

    let circleClasses = 'bg-gray-200 border-gray-300';
    let iconClasses = 'text-gray-400';
    let textClasses = 'opacity-50';

    if (isCompleted) {
        circleClasses = 'bg-green-100 border-green-500';
        iconClasses = 'text-green-600';
        textClasses = '';
    } else if (isInProgress) {
        circleClasses = 'bg-blue-100 border-blue-500 ring-4 ring-blue-200 animate-pulse';
        iconClasses = 'text-blue-600';
        textClasses = '';
    }

    return (
        <div className="flex">
            {/* Icon and line */}
            <div className="flex flex-col items-center mr-4">
                <div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${circleClasses}`}>
                        <span className={`material-symbols-outlined transition-colors duration-300 ${iconClasses}`}>
                            {isCompleted ? 'check_circle' : icon}
                        </span>
                    </div>
                </div>
                {!isLast && <div className="w-px h-full bg-gray-300"></div>}
            </div>
            {/* Content */}
            <div className={`pb-8 transition-opacity duration-300 ${textClasses}`}>
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600">{targetOutput}</p>
            </div>
        </div>
    );
};

const UMKMJourney: React.FC<{ setCurrentView: (view: View) => void }> = ({ setCurrentView }) => {
    const milestones = [
        { icon: 'how_to_reg', title: 'Pendaftaran & Legalitas', targetOutput: 'Memiliki NIB dan profil usaha terverifikasi.' },
        { icon: 'inventory_2', title: 'Branding & Produk', targetOutput: 'Memiliki foto, kemasan berlabel, dan deskripsi produk yang menarik.' },
        { icon: 'cast', title: 'Digitalisasi & Pemasaran', targetOutput: 'Aktif di medsos, terdaftar di TangselMart, dan menyediakan QRIS.' },
        { icon: 'school', title: 'Peningkatan Skill', targetOutput: 'Menyelesaikan minimal 2 kursus relevan di GoodSkill.' },
        { icon: 'public', title: 'Perluasan Pasar', targetOutput: 'Produk masuk kurasi unggulan dan terdaftar di program GoodEx.' },
    ];
    
    // For demonstration, let's say the current milestone is the 3rd one (index 2)
    const currentMilestoneIndex = 2;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="material-symbols-outlined mr-2 text-blue-500">route</span>
                Journey UMKM Naik Kelas
            </h3>
            <div>
                {milestones.map((milestone, index) => {
                    let status: MilestoneStatus = 'locked';
                    if (index < currentMilestoneIndex) {
                        status = 'completed';
                    } else if (index === currentMilestoneIndex) {
                        status = 'in-progress';
                    }
                    return (
                        <JourneyMilestone 
                            key={index}
                            {...milestone}
                            status={status}
                            isLast={index === milestones.length - 1}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
interface UMKMDashboardProps {
    setCurrentView: (view: View) => void;
    setActiveDashboardView: (view: DashboardView) => void;
}

const UMKMDashboard: React.FC<UMKMDashboardProps> = ({ setCurrentView, setActiveDashboardView }) => {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [profile, setProfile] = useState<DashboardUMKMProfile | null>(null);
    const [summary, setSummary] = useState<DashboardUMKMSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [membership, setMembership] = useState<MembershipInfo | null>(null);
    const [hasActiveMembership, setHasActiveMembership] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [profileData, summaryData, membershipData] = await Promise.all([
                    umkmService.getMyProfile(),
                    umkmService.getMySummary(),
                    paymentService.getMembershipStatus(),
                ]);

                setProfile(profileData);
                setSummary(summaryData);
                setHasActiveMembership(membershipData.hasActiveMembership);
                setMembership(membershipData.membership);
            } catch (err) {
                const message = err instanceof ApiError ? err.message : 'Gagal memuat data dashboard UMKM.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const readinessData = summary?.readiness ?? {
        id: profile?.id ?? '',
        readinessScore: profile ? (profile.readinessScore ?? calculateReadinessScore(profile)) : 0,
        financialRecording: profile?.financialRecording ?? 'none',
        productPackaging: profile?.productPackaging ?? 'basic',
        digitalPaymentAdoption: profile?.digitalPaymentAdoption ?? 'cash_only',
        onlinePresence: profile?.onlinePresence ?? 'none',
    };

    const score = readinessData.readinessScore ?? calculateReadinessScore(readinessData);

    const salesStats = useMemo(() => {
        return summary?.stats ?? {
            totalRevenue: 0,
            newOrders: 0,
            totalOrders: 0,
            bestSeller: 'Belum ada data',
        };
    }, [summary]);

    return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {error && (
                    <div className="lg:col-span-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="lg:col-span-3 rounded-lg border border-blue-100 bg-blue-50 p-6 text-center text-blue-600">
                        Memuat data dashboard UMKM...
                    </div>
                )}
        
        {/* Left Column (Main content) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Membership Status Card */}
            {!loading && (
                <div className={`p-6 rounded-lg shadow-lg ${hasActiveMembership ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                    <div className="flex items-center justify-between text-white">
                        <div className="flex-1">
                            {hasActiveMembership && membership ? (
                                <>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                                        <h3 className="text-2xl font-bold">Member Premium Aktif</h3>
                                    </div>
                                    <p className="text-sm opacity-90 mb-3">
                                        Paket: {membership.packageName} • Berakhir: {new Date(membership.expiresAt).toLocaleDateString('id-ID')}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                                            {membership.daysRemaining} hari tersisa
                                        </div>
                                        {membership.daysRemaining <= 30 && (
                                            <button 
                                                onClick={() => setActiveDashboardView(DashboardView.MembershipPremium)}
                                                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                                            >
                                                Perpanjang Membership
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="material-symbols-outlined text-3xl">diamond</span>
                                        <h3 className="text-2xl font-bold">Upgrade ke Premium</h3>
                                    </div>
                                    <p className="text-sm opacity-90 mb-3">
                                        Dapatkan akses eksklusif ke fitur premium, prioritas layanan, dan benefit lainnya
                                    </p>
                                    <button 
                                        onClick={() => setActiveDashboardView(DashboardView.MembershipPremium)}
                                        className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center space-x-2"
                                    >
                                        <span>Lihat Paket Premium</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="hidden md:block">
                            <span className="material-symbols-outlined text-8xl opacity-30">
                                {hasActiveMembership ? 'verified' : 'auto_awesome'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang, {user?.displayName || 'Pengguna'}!</h2>
                <p className="text-gray-600">
                                        Ini adalah pusat kendali untuk bisnis Anda. Gunakan menu di sebelah kiri untuk mengelola profil, produk, pesanan, dan lainnya.
                                        {profile ? ` Saat ini Anda mengelola ${profile.businessName}.` : ' Lengkapi profil usaha Anda untuk memaksimalkan fitur dashboard.'}
                </p>
            </div>

            {/* Sales Stats Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistik Penjualan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                        <StatCard icon="payments" title="Total Pendapatan" value={formatPrice(salesStats.totalRevenue)} color="bg-green-500" />
                                        <StatCard icon="shopping_cart_checkout" title="Pesanan Baru" value={String(salesStats.newOrders)} color="bg-yellow-500" />
                                        <StatCard icon="receipt_long" title="Total Pesanan" value={String(salesStats.totalOrders)} color="bg-blue-500" />
                                        <StatCard icon="star" title="Produk Terlaris" value={salesStats.bestSeller || 'Belum ada data'} color="bg-purple-500" />
                </div>
            </div>

            {/* Readiness Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">Skor Kesiapan Digital</h3>
                        <button 
                            onClick={() => setIsGuideOpen(true)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Lihat Panduan Kesiapan"
                        >
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                    </div>
                    <CircularProgress percentage={score} />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <MetricProgressBar title="Pencatatan Keuangan" metric="financialRecording" value={readinessData.financialRecording} />
                    <MetricProgressBar title="Kemasan Produk" metric="productPackaging" value={readinessData.productPackaging} />
                    <MetricProgressBar title="Pembayaran Digital" metric="digitalPaymentAdoption" value={readinessData.digitalPaymentAdoption} />
                    <MetricProgressBar title="Kehadiran Online" metric="onlinePresence" value={readinessData.onlinePresence} />
                </div>
            </div>
        </div>

        {/* Right Column (Side content) */}
        <div className="lg:col-span-1 space-y-8">
            <UMKMJourney setCurrentView={setCurrentView} />
        </div>
        
        <ReadinessGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default UMKMDashboard;