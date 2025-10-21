import { DashboardUMKMProfile } from '../src/types/dashboard';

export const SCORE_MAP = {
    financialRecording: { none: 0, manual: 1, spreadsheet: 2, app: 3 },
    productPackaging: { basic: 0, labeled: 1, professional: 2, irrelevant: 2 },
    digitalPaymentAdoption: { cash_only: 0, transfer: 1, ewallet: 2, qris: 3 },
    onlinePresence: { none: 0, social_media: 1, marketplace: 2, website: 3 },
};
export const MAX_SCORES = {
    financialRecording: 3,
    productPackaging: 2,
    digitalPaymentAdoption: 3,
    onlinePresence: 3,
};
export const LABELS = {
    financialRecording: { none: "Belum Ada", manual: "Manual", spreadsheet: "Spreadsheet", app: "Aplikasi" },
    productPackaging: { basic: "Sederhana", labeled: "Berlabel", professional: "Profesional", irrelevant: "Tidak Relevan" },
    digitalPaymentAdoption: { cash_only: "Tunai Saja", transfer: "Transfer Bank", ewallet: "E-Wallet", qris: "QRIS" },
    onlinePresence: { none: "Belum Ada", social_media: "Media Sosial", marketplace: "Marketplace", website: "Website" },
};

export const DESCRIPTIONS = {
    financialRecording: {
        none: "Pencatatan keuangan belum dilakukan secara rutin.",
        manual: "Keuangan dicatat manual di buku tulis.",
        spreadsheet: "Menggunakan spreadsheet seperti Excel untuk mencatat keuangan.",
        app: "Sudah memakai aplikasi kasir atau akuntansi digital."
    },
    productPackaging: {
        basic: "Kemasan produk masih sederhana, belum ada merek.",
        labeled: "Kemasan sudah dilengkapi stiker atau label merek.",
        professional: "Kemasan didesain secara profesional dan menarik.",
        irrelevant: "Kategori ini tidak berlaku untuk usaha jasa."
    },
    digitalPaymentAdoption: {
        cash_only: "Pembayaran hanya menerima uang tunai.",
        transfer: "Sudah menerima pembayaran via transfer bank.",
        ewallet: "Menerima pembayaran melalui e-wallet seperti GoPay/OVO.",
        qris: "Telah menyediakan QRIS untuk semua jenis pembayaran digital."
    },
    onlinePresence: {
        none: "Usaha belum memiliki kehadiran di platform online.",
        social_media: "Aktif di media sosial seperti Instagram atau Facebook.",
        marketplace: "Produk dijual melalui marketplace seperti Tokopedia/Shopee.",
        website: "Memiliki website atau toko online sendiri."
    },
};


export const calculateReadinessScore = (umkm: Pick<DashboardUMKMProfile, 'financialRecording' | 'productPackaging' | 'digitalPaymentAdoption' | 'onlinePresence'>): number => {
    const totalScore = 
        (SCORE_MAP.financialRecording[umkm.financialRecording || 'none']) +
        (SCORE_MAP.productPackaging[umkm.productPackaging || 'basic']) +
        (SCORE_MAP.digitalPaymentAdoption[umkm.digitalPaymentAdoption || 'cash_only']) +
        (SCORE_MAP.onlinePresence[umkm.onlinePresence || 'none']);
    
    const maxScore = Object.values(MAX_SCORES).reduce((acc, val) => acc + val, 0);
    if (maxScore === 0) return 0;
    return Math.round((totalScore / maxScore) * 100);
};