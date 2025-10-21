import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardUMKMProfile } from '../../src/types/dashboard';

interface MembershipCardProps {
    profile?: DashboardUMKMProfile | null;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ profile }) => {
    const { user } = useAuth();

    // Ambil data utama dari profil UMKM apabila tersedia agar kartu menampilkan informasi usaha terbaru.
    const businessName = profile?.businessName || user?.displayName || user?.email?.split('@')[0] || 'Nama Usaha';
    const ownerName = profile?.ownerName || user?.displayName || 'Pemilik Usaha';
    const avatarSource = profile?.imageUrl || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=4338CA&color=FFFFFF&size=128`;

    const memberSince = 'Juni 2024';
    const membershipType = profile?.verificationStatus === 'verified' ? 'UMKM Juara' : 'UMKM Mitra';

    // Gunakan ID user dari auth context dan fallback aman agar tidak melempar error ketika null.
    const memberId = user?.id
        ? `KD-${user.id.substring(0, 8).toUpperCase()}`
        : 'KD-XXXXXXXX';

    // Generate QR code data berbasis profil aktual agar petugas dapat memverifikasi usaha secara cepat.
    const qrData = JSON.stringify({
        businessName,
        ownerName,
        id: memberId,
        type: membershipType,
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}&bgcolor=1E3A8A&color=FFFFFF&qzone=1`;

    return (
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-2xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-3xl text-blue-200">shield</span>
                            <span className="font-bold text-lg">Kampung Digital</span>
                        </div>
                        <p className="text-xs text-blue-200">Tangerang Selatan</p>
                    </div>
                    <span className="font-semibold text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">{membershipType}</span>
                </div>

                <div className="flex items-center space-x-4 mt-8">
                    <img
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 flex-shrink-0"
                        src={avatarSource}
                        alt="Foto Profil"
                    />
                    <div className="flex-grow min-w-0">
                        <p className="text-sm text-blue-300">Nama Usaha</p>
                        <h3 className="text-xl font-bold truncate">{businessName}</h3>
                        <p className="text-xs text-blue-300 mt-2">Pemilik</p>
                        <p className="font-medium truncate">{ownerName}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mt-6">
                <div>
                    <p className="text-sm text-blue-300">Anggota Sejak</p>
                    <p className="font-semibold">{memberSince}</p>
                </div>
                <div className="bg-white p-1 rounded-lg shadow-md">
                    <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>
    );
};

export default MembershipCard;