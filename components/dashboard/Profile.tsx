import React, { useEffect, useRef, useState } from 'react';
import MembershipCard from './MembershipCard';
import { umkmService, UMKMUpsertPayload } from '../../src/services/umkmService';
import { DashboardUMKMProfile } from '../../src/types/dashboard';
import { ApiError } from '../../src/services/api';

interface ProfileProps {
    onProfileSaved?: (profile: DashboardUMKMProfile) => void;
    showProfileReminder?: boolean;
}

interface FormState {
    businessName: string;
    ownerName: string;
    category: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    financialRecording: string;
    productPackaging: string;
    digitalPaymentAdoption: string;
    onlinePresence: string;
}

const defaultFormState: FormState = {
    businessName: '',
    ownerName: '',
    category: 'Kuliner',
    phone: '',
    email: '',
    address: '',
    description: '',
    financialRecording: 'none',
    productPackaging: 'basic',
    digitalPaymentAdoption: 'cash_only',
    onlinePresence: 'none',
};

const Profile: React.FC<ProfileProps> = ({ onProfileSaved, showProfileReminder = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormState>(defaultFormState);
    const [formErrors, setFormErrors] = useState<Record<keyof Pick<FormState, 'businessName' | 'ownerName' | 'phone' | 'email' | 'description'>, string>>({
        businessName: '',
        ownerName: '',
        phone: '',
        email: '',
        description: '',
    });
    const [profile, setProfile] = useState<DashboardUMKMProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const businessNameRef = useRef<HTMLInputElement | null>(null);
    const activeFieldRef = useRef<keyof FormState | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const myProfile = await umkmService.getMyProfile();
                if (myProfile) {
                    setProfile(myProfile);
                    setFormData({
                        businessName: myProfile.businessName,
                        ownerName: myProfile.ownerName,
                        category: myProfile.category,
                        phone: myProfile.phone || '',
                        email: myProfile.email || '',
                        address: myProfile.address || '',
                        description: myProfile.description || '',
                        financialRecording: myProfile.financialRecording || 'none',
                        productPackaging: myProfile.productPackaging || 'basic',
                        digitalPaymentAdoption: myProfile.digitalPaymentAdoption || 'cash_only',
                        onlinePresence: myProfile.onlinePresence || 'none',
                    });
                } else {
                    setIsEditing(true);
                }
            } catch (err) {
                const message = err instanceof ApiError ? err.message : 'Gagal memuat profil UMKM.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (isEditing && businessNameRef.current) {
            businessNameRef.current.focus();
            businessNameRef.current.select();
        }
    }, [isEditing]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const fieldName = name as keyof FormState;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        setStatusMessage(null);

        if (fieldName in formErrors && formErrors[fieldName as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleFocus = (field: keyof FormState) => {
        activeFieldRef.current = field;
    };

    useEffect(() => {
        if (!isEditing || !activeFieldRef.current) {
            return;
        }

        const selector = `[name="${activeFieldRef.current}"]`;
        const element = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
        if (element && document.activeElement !== element) {
            element.focus({ preventScroll: true });

            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                const length = element.value.length;
                const selectableTypes = new Set(['text', 'search', 'tel', 'url', 'password']);

                try {
                    // Menjaga posisi kursor di akhir hanya untuk elemen yang mendukung seleksi agar tidak memicu InvalidStateError.
                    if (element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && selectableTypes.has(element.type))) {
                        element.setSelectionRange(length, length);
                    }
                } catch {
                    // Fallback diam-diam: beberapa input (misal email/number) memang tidak mendukung setSelectionRange.
                }
            }
        }
    }, [formData, isEditing]);

    const validate = () => {
        const errors = {
            businessName: '',
            ownerName: '',
            phone: '',
            email: '',
            description: '',
        };
        let isValid = true;

        if (!formData.businessName.trim()) {
            errors.businessName = 'Nama usaha wajib diisi.';
            isValid = false;
        }
        if (!formData.ownerName.trim()) {
            errors.ownerName = 'Nama pemilik wajib diisi.';
            isValid = false;
        }
        if (!formData.description.trim()) {
            errors.description = 'Deskripsi wajib diisi.';
            isValid = false;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Format email tidak valid.';
            isValid = false;
        }
        if (formData.phone) {
            const normalizedPhone = formData.phone.replace(/[\s-]/g, '');
            const phonePattern = /^(?:\+62|62|0)[1-9][0-9]{6,12}$/;
            if (!phonePattern.test(normalizedPhone)) {
                errors.phone = 'Format nomor telepon tidak valid. Gunakan awalan 08, +62, atau 62.';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        const normalizedPhone = formData.phone ? formData.phone.replace(/[\s-]/g, '') : undefined;
        const payload: UMKMUpsertPayload = {
            businessName: formData.businessName.trim(),
            ownerName: formData.ownerName.trim(),
            category: formData.category,
            description: formData.description.trim(),
            address: formData.address.trim() || undefined,
            phone: normalizedPhone,
            email: formData.email.trim() || undefined,
            financialRecording: formData.financialRecording,
            productPackaging: formData.productPackaging,
            digitalPaymentAdoption: formData.digitalPaymentAdoption,
            onlinePresence: formData.onlinePresence,
        };

        try {
            setSubmitting(true);
            setError(null);
            setStatusMessage(null);
            let updatedProfile: DashboardUMKMProfile;

            if (profile) {
                updatedProfile = await umkmService.update(profile.id, payload);
            } else {
                updatedProfile = await umkmService.create(payload);
            }

            setProfile(updatedProfile);
            onProfileSaved?.(updatedProfile);
            setFormData({
                businessName: updatedProfile.businessName,
                ownerName: updatedProfile.ownerName,
                category: updatedProfile.category,
                phone: updatedProfile.phone || '',
                email: updatedProfile.email || '',
                address: updatedProfile.address || '',
                description: updatedProfile.description || '',
                financialRecording: updatedProfile.financialRecording || 'none',
                productPackaging: updatedProfile.productPackaging || 'basic',
                digitalPaymentAdoption: updatedProfile.digitalPaymentAdoption || 'cash_only',
                onlinePresence: updatedProfile.onlinePresence || 'none',
            });
            setStatusMessage('Profil usaha berhasil disimpan.');
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal menyimpan profil.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const InputField: React.FC<{ label: string; name: keyof FormState; value: string; type?: string; error?: string; inputRef?: React.RefObject<HTMLInputElement> }> = ({ label, name, value, type = 'text', error, inputRef }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {isEditing ? (
                <>
                    <input
                        id={name}
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => handleFocus(name)}
                        ref={inputRef}
                        className={`mt-1 block w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </>
            ) : (
                <p className="mt-1 flex h-10 items-center rounded-md bg-gray-50 p-2 text-gray-900">{value || '-'}</p>
            )}
        </div>
    );

    const SelectField: React.FC<{
        label: string;
        name: keyof FormState;
        value: string;
        options: { value: string; label: string }[];
    }> = ({ label, name, value, options }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {isEditing ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => handleFocus(name)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            ) : (
                <p className="mt-1 flex h-10 items-center rounded-md bg-gray-50 p-2 text-gray-900">{options.find(option => option.value === value)?.label || '-'}</p>
            )}
        </div>
    );

    const financialRecordingOptions = [
        { value: 'none', label: 'Belum Ada' },
        { value: 'manual', label: 'Manual (Buku Tulis)' },
        { value: 'spreadsheet', label: 'Spreadsheet (Excel/Sheets)' },
        { value: 'app', label: 'Aplikasi Kasir/Akuntansi' },
    ];
    const productPackagingOptions = [
        { value: 'basic', label: 'Sederhana (Tanpa Merek)' },
        { value: 'labeled', label: 'Berlabel Merek' },
        { value: 'professional', label: 'Desain Profesional' },
        { value: 'irrelevant', label: 'Tidak Relevan (untuk Jasa)' },
    ];
    const digitalPaymentOptions = [
        { value: 'cash_only', label: 'Hanya Tunai' },
        { value: 'transfer', label: 'Transfer Bank' },
        { value: 'ewallet', label: 'E-Wallet' },
        { value: 'qris', label: 'QRIS' },
    ];
    const onlinePresenceOptions = [
        { value: 'none', label: 'Belum Ada' },
        { value: 'social_media', label: 'Media Sosial' },
        { value: 'marketplace', label: 'Marketplace' },
        { value: 'website', label: 'Website/Toko Online Pribadi' },
    ];

    return (
        <div className="grid grid-cols-1 gap-8 animate-fade-in lg:grid-cols-3">
            <div className="lg:col-span-1">
                {/* Kartu membership kini menerima profil UMKM agar informasi terkini tersinkron otomatis. */}
                <MembershipCard profile={profile} />
            </div>
            <div className="lg:col-span-2 rounded-lg border bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profil Usaha</h2>
                        {loading && <p className="text-sm text-gray-500">Memuat profil usaha...</p>}
                        {!loading && !profile && <p className="text-sm text-gray-500">Belum ada profil UMKM. Lengkapi informasi berikut untuk mulai berjualan.</p>}
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            <span className="material-symbols-outlined">edit</span>
                            <span>{profile ? 'Ubah Profil' : 'Buat Profil'}</span>
                        </button>
                    )}
                </div>

                {showProfileReminder && !loading && !profile && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                        Lengkapi detail usaha Anda supaya dashboard menampilkan analitik dan layanan yang relevan untuk UMKM baru.
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {statusMessage && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {statusMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputField
                            label="Nama Usaha"
                            name="businessName"
                            value={formData.businessName}
                            error={formErrors.businessName}
                            inputRef={businessNameRef}
                        />
                        <InputField label="Nama Pemilik" name="ownerName" value={formData.ownerName} error={formErrors.ownerName} />
                        <SelectField
                            label="Kategori Usaha"
                            name="category"
                            value={formData.category}
                            options={[
                                { value: 'Kuliner', label: 'Kuliner' },
                                { value: 'Fashion', label: 'Fashion' },
                                { value: 'Jasa', label: 'Jasa' },
                                { value: 'Kreatif', label: 'Kreatif' },
                                { value: 'Lainnya', label: 'Lainnya' },
                            ]}
                        />
                        <InputField label="Nomor Telepon" name="phone" value={formData.phone} error={formErrors.phone} />
                        <InputField label="Email" name="email" value={formData.email} type="email" error={formErrors.email} />
                        <InputField label="Alamat" name="address" value={formData.address} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                        {isEditing ? (
                            <>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('description')}
                                    rows={3}
                                    className={`mt-1 block w-full rounded-md border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                />
                                {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
                            </>
                        ) : (
                            <p className="mt-1 rounded-md bg-gray-50 p-3 text-gray-900">{formData.description || '-'}</p>
                        )}
                    </div>

                    <h3 className="border-t pt-6 text-lg font-medium text-gray-900">Profil Kesiapan Digital</h3>
                    <p className="-mt-4 text-sm text-gray-500">Informasi ini berpengaruh pada skor kesiapan digital dan rekomendasi program.</p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SelectField label="Pencatatan Keuangan" name="financialRecording" value={formData.financialRecording} options={financialRecordingOptions} />
                        <SelectField label="Kemasan Produk" name="productPackaging" value={formData.productPackaging} options={productPackagingOptions} />
                        <SelectField label="Pembayaran Digital" name="digitalPaymentAdoption" value={formData.digitalPaymentAdoption} options={digitalPaymentOptions} />
                        <SelectField label="Kehadiran Online" name="onlinePresence" value={formData.onlinePresence} options={onlinePresenceOptions} />
                    </div>

                    {isEditing && (
                        <div className="flex justify-end space-x-4 border-t pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (profile) {
                                        setFormData({
                                            businessName: profile.businessName,
                                            ownerName: profile.ownerName,
                                            category: profile.category,
                                            phone: profile.phone || '',
                                            email: profile.email || '',
                                            address: profile.address || '',
                                            description: profile.description || '',
                                            financialRecording: profile.financialRecording || 'none',
                                            productPackaging: profile.productPackaging || 'basic',
                                            digitalPaymentAdoption: profile.digitalPaymentAdoption || 'cash_only',
                                            onlinePresence: profile.onlinePresence || 'none',
                                        });
                                    } else {
                                        setFormData(defaultFormState);
                                    }
                                        setIsEditing(false);
                                        setStatusMessage(null);
                                }}
                                className="rounded-full bg-gray-200 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full bg-green-500 px-6 py-2 font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-400"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;