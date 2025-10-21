import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DashboardProduct, ProductFormState, ProductInput } from '../../src/types/dashboard';
import { productService } from '../../src/services/productService';
import { ApiError } from '../../src/services/api';
import { mediaService } from '../../src/services/mediaService';

type ImageMode = 'url' | 'upload' | 'gemini';
type AspectRatioOption = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
// Daftar mode dan rasio disimpan terpusat agar mudah dikembangkan lagi (misal menambah varian baru).
const IMAGE_MODES: ImageMode[] = ['url', 'upload', 'gemini'];
const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = ['1:1', '4:3', '3:4', '16:9', '9:16'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const defaultFormState: ProductFormState = {
    name: '',
    price: '',
    stockQuantity: '0',
    category: '',
    description: '',
    imageUrl: '',
};

const defaultErrorState: Record<keyof ProductFormState, string> = {
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    description: '',
    imageUrl: '',
};

const Products: React.FC = () => {
    const [products, setProducts] = useState<DashboardProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formState, setFormState] = useState<ProductFormState>(defaultFormState);
    const [formErrors, setFormErrors] = useState<Record<keyof ProductFormState, string>>({ ...defaultErrorState });
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DashboardProduct | null>(null);
    // State di bawah mengatur pengalaman pengelolaan gambar (AI, upload, atau URL manual).
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageMode, setImageMode] = useState<ImageMode>('url');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imagePrompt, setImagePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
    const [imageStatus, setImageStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getMyProducts();
            setProducts(data);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal memuat produk. Coba lagi.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleOpenModal = (product?: DashboardProduct) => {
        if (product) {
            setEditingProduct(product);
            setFormState({
                name: product.name,
                price: String(product.price),
                stockQuantity: String(product.stockQuantity ?? 0),
                category: product.category || '',
                description: product.description || '',
                imageUrl: product.imageUrl || '',
            });
            setImagePreview(product.imageUrl || null);
            setImageMode(product.imageUrl ? 'url' : 'gemini');
        } else {
            setEditingProduct(null);
            setFormState(defaultFormState);
            setImagePreview(null);
            setImageMode('gemini');
        }

        // Reset konfigurasi bantu gambar setiap kali modal dibuka.
        setImagePrompt('');
        setAspectRatio('1:1');
    setImageStatus(null);
        setImageLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setFormErrors({ ...defaultErrorState });
        setIsModalOpen(true);
    };

    const validateForm = () => {
        const errors: Record<keyof ProductFormState, string> = { ...defaultErrorState };
        let isValid = true;

        if (!formState.name.trim()) {
            errors.name = 'Nama produk wajib diisi.';
            isValid = false;
        }

        const parsedPrice = Number(formState.price);
        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            errors.price = 'Harga harus lebih dari 0.';
            isValid = false;
        }

        const parsedStock = Number(formState.stockQuantity);
        if (Number.isNaN(parsedStock) || parsedStock < 0) {
            errors.stockQuantity = 'Stok tidak boleh bernilai negatif.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Mode selection membantu pengguna memilih cara input gambar yang paling nyaman.
    const handleImageModeChange = (mode: ImageMode) => {
        setImageMode(mode);
        setImageStatus(null);
    };

    const isRealSessionAvailable = () => {
        if (typeof window === 'undefined') {
            return false;
        }
        const token = localStorage.getItem('access_token');
        return Boolean(token);
    };

    // Trigger file input agar kita dapat menggunakan tombol custom.
    const handleBrowseFile = () => {
        fileInputRef.current?.click();
    };

    // Upload file segera setelah dipilih untuk meminimalisir langkah pengguna.
    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!isRealSessionAvailable()) {
            setImageStatus({
                type: 'error',
                message: 'Harap login menggunakan akun backend asli sebelum mengunggah gambar. Akun demo tidak memiliki akses ke server.',
            });
            return;
        }

        if (file.size > 7 * 1024 * 1024) {
            setImageStatus({ type: 'error', message: 'Ukuran file melebihi batas 7MB. Kecilkan gambar terlebih dahulu.' });
            return;
        }

        setImageLoading(true);
        setImageStatus({ type: 'info', message: 'Mengunggah gambar produk...' });
        try {
            const uploadedUrl = await mediaService.uploadProductImage(file);
            setFormState(prev => ({ ...prev, imageUrl: uploadedUrl }));
            setImagePreview(uploadedUrl);
            setImageStatus({ type: 'success', message: 'Gambar berhasil diunggah.' });
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setImageStatus({
                    type: 'error',
                    message: 'Sesi sudah kedaluwarsa atau tidak memiliki access token. Silakan login ulang untuk melanjutkan.',
                });
            } else {
                const message = err instanceof ApiError ? err.message : 'Gagal mengunggah gambar produk.';
                setImageStatus({ type: 'error', message });
            }
        } finally {
            setImageLoading(false);
        }
    };

    // Integrasi Gemini: generate gambar dari prompt deskriptif produk.
    const handleGenerateImage = async () => {
        if (!imagePrompt.trim()) {
            setImageStatus({ type: 'error', message: 'Tuliskan deskripsi singkat produk sebelum membuat gambar.' });
            return;
        }

        if (!isRealSessionAvailable()) {
            setImageStatus({
                type: 'error',
                message: 'Fitur AI membutuhkan sesi login backend yang valid. Gunakan kredensial produksi dan pastikan token tersimpan.',
            });
            return;
        }

        setImageLoading(true);
        setImageStatus({ type: 'info', message: 'INA sedang membuat gambar dengan Gemini...' });
        try {
            const generatedUrl = await mediaService.generateProductImage(imagePrompt, aspectRatio);
            setFormState(prev => ({ ...prev, imageUrl: generatedUrl }));
            setImagePreview(generatedUrl);
            setImageStatus({ type: 'success', message: 'Gambar selesai dibuat oleh Gemini.' });
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setImageStatus({
                    type: 'error',
                    message: 'Token akses tidak ditemukan. Silakan login ulang agar INA dapat membuat gambar.',
                });
            } else {
                const message = err instanceof ApiError ? err.message : 'Gemini gagal membuat gambar. Coba ubah prompt.';
                setImageStatus({ type: 'error', message });
            }
        } finally {
            setImageLoading(false);
        }
    };

    useEffect(() => {
        if (formState.imageUrl) {
            setImagePreview(formState.imageUrl);
        } else if (imageMode === 'url') {
            setImagePreview(null);
        }
    }, [formState.imageUrl, imageMode]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        const payload: ProductInput = {
            name: formState.name.trim(),
            price: Number(formState.price),
            stockQuantity: Number(formState.stockQuantity),
            category: formState.category.trim() || undefined,
            description: formState.description.trim() || undefined,
            imageUrl: formState.imageUrl.trim() || undefined,
        };

        try {
            setSubmitting(true);
            if (editingProduct) {
                const updated = await productService.updateProduct(editingProduct.id, payload);
                setProducts(prev => prev.map(product => (product.id === updated.id ? updated : product)));
            } else {
                const created = await productService.createProduct(payload);
                setProducts(prev => [created, ...prev]);
            }
            setIsModalOpen(false);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal menyimpan produk.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (product: DashboardProduct) => {
        const confirmed = window.confirm(`Hapus produk "${product.name}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await productService.deleteProduct(product.id);
            setProducts(prev => prev.filter(item => item.id !== product.id));
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal menghapus produk.';
            setError(message);
        }
    };

    const totalInventoryValue = useMemo(() =>
        products.reduce((acc, product) => acc + product.price * (product.stockQuantity ?? 0), 0),
        [products]
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Produk Saya</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola produk di Kampung Digital, lengkap dengan stok dan harga terkini.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 flex items-center space-x-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Tambah Produk</span>
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Produk Aktif</p>
                    <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Nilai Stok</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalInventoryValue)}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                    <p className="text-2xl font-bold text-gray-800">{products[0]?.updatedAt ? new Date(products[0].updatedAt).toLocaleDateString('id-ID') : '-'}</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    Memuat produk...
                                </td>
                            </tr>
                        )}
                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
                                        <p className="font-semibold">Belum ada produk</p>
                                        <p className="text-sm">Mulai tambah produk pertama Anda untuk tampil di Kampung Digital.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img
                                                className="h-12 w-12 rounded-md object-cover"
                                                src={product.imageUrl || 'https://placeholder.co/96x96?text=Produk'}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">Dibuat {new Date(product.createdAt).toLocaleDateString('id-ID')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stockQuantity > 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ubah
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
                    <div className="w-full max-w-xl max-h-[90vh] rounded-lg bg-white shadow-xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingProduct ? 'Perbarui Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Tutup"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 px-6 py-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={event => setFormState(prev => ({ ...prev, name: event.target.value }))}
                                    className={`mt-1 w-full rounded-md border ${formErrors.name ? 'border-red-400' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    placeholder="Contoh: Bakso Urat Super"
                                    required
                                />
                                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Harga</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="price"
                                        value={formState.price}
                                        onChange={event => setFormState(prev => ({ ...prev, price: event.target.value }))}
                                        className={`mt-1 w-full rounded-md border ${formErrors.price ? 'border-red-400' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        required
                                    />
                                    {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stok</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="stockQuantity"
                                        value={formState.stockQuantity}
                                        onChange={event => setFormState(prev => ({ ...prev, stockQuantity: event.target.value }))}
                                        className={`mt-1 w-full rounded-md border ${formErrors.stockQuantity ? 'border-red-400' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        required
                                    />
                                    {formErrors.stockQuantity && <p className="mt-1 text-xs text-red-500">{formErrors.stockQuantity}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formState.category}
                                    onChange={event => setFormState(prev => ({ ...prev, category: event.target.value }))}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Contoh: Makanan Utama"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
                                <p className="mt-1 text-xs text-gray-500">Pilih salah satu metode: gunakan tautan yang sudah ada, unggah manual, atau minta Gemini membuatkan ilustrasi produk.</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {IMAGE_MODES.map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => handleImageModeChange(mode)}
                                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${imageMode === mode ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {mode === 'url' && 'Gunakan URL'}
                                            {mode === 'upload' && 'Unggah Manual'}
                                            {mode === 'gemini' && 'Buat via Gemini'}
                                        </button>
                                    ))}
                                </div>

                                {imageMode === 'url' && (
                                    <div className="mt-3 space-y-2">
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            value={formState.imageUrl}
                                            onChange={event => setFormState(prev => ({ ...prev, imageUrl: event.target.value }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="https://cdn.kampungdigital.id/produk-anda.png"
                                        />
                                        <p className="text-xs text-gray-500">Gunakan tautan langsung ke file gambar (PNG/JPG/WebP) agar bisa dipreview.</p>
                                    </div>
                                )}

                                {imageMode === 'upload' && (
                                    <div className="mt-3 space-y-3">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            className="hidden"
                                            onChange={handleFileSelected}
                                        />
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <button
                                                type="button"
                                                onClick={handleBrowseFile}
                                                disabled={imageLoading}
                                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                                            >
                                                Pilih File
                                            </button>
                                            <span className="text-xs text-gray-500">Format: JPG, PNG, atau WebP dengan ukuran maksimal 7MB.</span>
                                        </div>
                                    </div>
                                )}

                                {imageMode === 'gemini' && (
                                    <div className="mt-3 space-y-3">
                                        <textarea
                                            value={imagePrompt}
                                            onChange={event => setImagePrompt(event.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Contoh: Foto produk sambal terasi homemade dalam botol kaca dengan latar kayu alami."
                                        />
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="text-xs font-semibold text-gray-600">Rasio:</label>
                                            <select
                                                value={aspectRatio}
                                                onChange={event => setAspectRatio(event.target.value as AspectRatioOption)}
                                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                {ASPECT_RATIO_OPTIONS.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}{option === '1:1' ? ' (Kotak)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={handleGenerateImage}
                                                disabled={imageLoading}
                                                className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                                            >
                                                {imageLoading ? 'Membuat...' : 'Buat Gambar' }
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">Tulis deskripsi yang spesifik (bahan, gaya foto, latar) untuk hasil yang lebih sesuai.</p>
                                    </div>
                                )}

                                {imageStatus && (
                                    <p className={`mt-3 text-xs ${imageStatus.type === 'error' ? 'text-red-500' : imageStatus.type === 'success' ? 'text-green-600' : 'text-gray-500'}`}>
                                        {imageStatus.message}
                                    </p>
                                )}

                                {imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-gray-600">Pratinjau</p>
                                        <img
                                            src={imagePreview}
                                            alt="Pratinjau produk"
                                            className="mt-2 h-40 w-40 rounded-md object-cover shadow"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    name="description"
                                    value={formState.description}
                                    onChange={event => setFormState(prev => ({ ...prev, description: event.target.value }))}
                                    rows={3}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Ceritakan keunikan produk Anda"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                                >
                                    {submitting ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;