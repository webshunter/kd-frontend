import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../src/services/api';

interface NotificationPrefs {
    newOrders: boolean;
    forumReplies: boolean;
    monthlyReports: boolean;
}

const defaultNotifications: NotificationPrefs = {
    newOrders: true,
    forumReplies: true,
    monthlyReports: false,
};

const Settings: React.FC = () => {
    const { user, updateProfile, changePassword } = useAuth();

    const [profileForm, setProfileForm] = useState({
        displayName: user?.displayName || user?.fullName || '',
        photoURL: user?.photoURL || '',
    });
    const [profileMessage, setProfileMessage] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const storageKey = useMemo(() => `kd_notifications_${user?.id ?? 'guest'}`, [user?.id]);
    const [notifications, setNotifications] = useState<NotificationPrefs>(defaultNotifications);

    // Sinkronkan form profil dengan data user terbaru.
    useEffect(() => {
        setProfileForm({
            displayName: user?.displayName || user?.fullName || '',
            photoURL: user?.photoURL || '',
        });
    }, [user?.displayName, user?.fullName, user?.photoURL]);

    // Muat preferensi notifikasi pribadi.
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setNotifications({ ...defaultNotifications, ...JSON.parse(saved) });
            } else {
                setNotifications(defaultNotifications);
            }
        } catch (error) {
            console.warn('Gagal memuat pengaturan notifikasi:', error);
            setNotifications(defaultNotifications);
        }
    }, [storageKey]);

    const persistNotifications = (prefs: NotificationPrefs) => {
        localStorage.setItem(storageKey, JSON.stringify(prefs));
    };

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setNotifications(prev => {
            const updated = { ...prev, [name]: checked } as NotificationPrefs;
            persistNotifications(updated);
            return updated;
        });
    };

    const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProfileMessage(null);
        setProfileError(null);

        if (!profileForm.displayName.trim()) {
            setProfileError('Nama tampilan tidak boleh kosong.');
            return;
        }

        try {
            setProfileLoading(true);
            await updateProfile({
                fullName: profileForm.displayName.trim(),
                displayName: profileForm.displayName.trim(),
                photoURL: profileForm.photoURL.trim() || undefined,
            });
            setProfileMessage('Profil berhasil diperbarui.');
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Gagal memperbarui profil. Coba lagi.';
            setProfileError(message);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordMessage(null);
        setPasswordError(null);

        const { currentPassword, newPassword, confirmPassword } = passwordForm;
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Lengkapi seluruh kolom kata sandi.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Konfirmasi kata sandi tidak cocok.');
            return;
        }

        try {
            setPasswordLoading(true);
            await changePassword(currentPassword, newPassword);
            setPasswordMessage('Kata sandi berhasil diubah.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Gagal mengubah kata sandi. Coba lagi.';
            setPasswordError(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Pengaturan Akun */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Pengaturan Akun</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Nama Tampilan</label>
                        <input
                            id="displayName"
                            name="displayName"
                            value={profileForm.displayName}
                            onChange={event => setProfileForm(prev => ({ ...prev, displayName: event.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Nama lengkap usaha"
                        />
                    </div>
                    <div>
                        <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">Foto Profil (URL)</label>
                        <input
                            id="photoUrl"
                            name="photoUrl"
                            value={profileForm.photoURL}
                            onChange={event => setProfileForm(prev => ({ ...prev, photoURL: event.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="https://..."
                        />
                        <p className="mt-2 text-xs text-gray-500">Kosongkan untuk menggunakan avatar otomatis dari nama Anda.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Terdaftar</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
                        />
                    </div>
                    {(profileError || profileMessage) && (
                        <div className={`rounded-md border px-3 py-2 text-sm ${profileError ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-600'}`}>
                            {profileError || profileMessage}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {profileLoading ? 'Menyimpan...' : 'Simpan Profil'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Ganti Kata Sandi */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Keamanan Akun</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Kata Sandi Saat Ini</label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={event => setPasswordForm(prev => ({ ...prev, currentPassword: event.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={event => setPasswordForm(prev => ({ ...prev, newPassword: event.target.value }))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Minimal 8 karakter"
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi Baru</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={event => setPasswordForm(prev => ({ ...prev, confirmPassword: event.target.value }))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Ulangi kata sandi"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                    {(passwordError || passwordMessage) && (
                        <div className={`rounded-md border px-3 py-2 text-sm ${passwordError ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-600'}`}>
                            {passwordError || passwordMessage}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {passwordLoading ? 'Mengubah...' : 'Perbarui Kata Sandi'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Pengaturan Notifikasi */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Pengaturan Notifikasi</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span id="newOrders-label" className="flex-grow">
                            <p className="font-medium text-gray-800">Notifikasi Pesanan Baru</p>
                            <p className="text-sm text-gray-500">Email dikirim setiap ada pesanan masuk dari pelanggan.</p>
                        </span>
                        <label className="switch">
                            <input type="checkbox" name="newOrders" checked={notifications.newOrders} onChange={handleNotificationChange} aria-labelledby="newOrders-label" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <span id="forumReplies-label" className="flex-grow">
                            <p className="font-medium text-gray-800">Balasan Forum</p>
                            <p className="text-sm text-gray-500">Dapatkan update ketika diskusi Anda di Forum Tangsel mendapat balasan.</p>
                        </span>
                        <label className="switch">
                            <input type="checkbox" name="forumReplies" checked={notifications.forumReplies} onChange={handleNotificationChange} aria-labelledby="forumReplies-label" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <span id="monthlyReports-label" className="flex-grow">
                            <p className="font-medium text-gray-800">Laporan Bulanan</p>
                            <p className="text-sm text-gray-500">Ringkasan performa toko otomatis dikirim setiap akhir bulan.</p>
                        </span>
                        <label className="switch">
                            <input type="checkbox" name="monthlyReports" checked={notifications.monthlyReports} onChange={handleNotificationChange} aria-labelledby="monthlyReports-label" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Delete Account Placeholder */}
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h2 className="text-xl font-bold text-red-800">Hapus Akun</h2>
                <p className="text-sm text-red-700 mt-2">Hubungi Admin Kampung Digital melalui kanal resmi untuk proses penutupan akun permanen.</p>
                <button className="mt-4 rounded-full bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition duration-300">
                    Ajukan Permintaan Penutupan
                </button>
            </div>
        </div>
    );
};

export default Settings;