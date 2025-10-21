import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

// --- NEW DETAILED TYPE ---
interface FundingOption {
    icon: string;
    title: string;
    provider: string;
    description: string;
    color: string;
    image: string;
    detailedDescription: string;
    benefits: string[];
    requirements: string[];
    process: { title: string; description: string }[];
}


// --- DETAIL VIEW COMPONENT ---
const FundingDetailView: React.FC<{ funding: FundingOption; onBack: () => void; }> = ({ funding, onBack }) => (
    <div className="animate-fade-in">
        <div className="container mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Opsi Pendanaan
            </button>
        </div>
        
        <section className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${funding.image}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
            <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white">{funding.title}</h1>
                    <p className="text-xl text-blue-200 font-light">{funding.provider}</p>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Deskripsi Lengkap</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{funding.detailedDescription}</p>
                    </div>

                    <div className="mb-12">
                         <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Syarat & Ketentuan</h2>
                         <ul className="space-y-3">
                            {funding.requirements.map((req, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="material-symbols-outlined text-blue-500 !text-xl mr-3 mt-0.5">verified</span>
                                    <span className="text-gray-700">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">Proses Pengajuan</h2>
                        <div className="space-y-8 relative">
                            <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-gray-200"></div>
                            {funding.process.map((step, index) => (
                                <div key={index} className="relative flex items-start space-x-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg z-10">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-3">star</span>
                            Keunggulan Utama
                        </h3>
                        <ul className="space-y-3">
                            {funding.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="material-symbols-outlined text-green-500 !text-xl mr-2 mt-0.5">check_circle</span>
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-8 bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition duration-300">
                            Ajukan Sekarang
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    </div>
);


const FundingCard: React.FC<{ icon: string; title: string; description: string; provider: string; color: string; onSelect: () => void; }> = ({ icon, title, description, provider, color, onSelect }) => (
    <div 
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
        className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${color} hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex flex-col`}
    >
        <div className="flex items-center space-x-4 mb-3">
            <span className={`material-symbols-outlined text-4xl`}>{icon}</span>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-sm font-semibold text-gray-500">{provider}</p>
            </div>
        </div>
        <p className="text-gray-600 flex-grow">{description}</p>
        <div className="mt-4 text-right">
             <span className="font-semibold text-blue-600 hover:text-blue-800 text-sm flex items-center justify-end">
                Lihat Detail <span className="material-symbols-outlined !text-base ml-1">arrow_forward</span>
            </span>
        </div>
    </div>
);

const FundingApplicationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        fundingAmount: '',
        purpose: '',
    });
    const [errors, setErrors] = useState({
        businessName: '',
        fundingAmount: '',
        purpose: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = { businessName: '', fundingAmount: '', purpose: '' };
        let isValid = true;
        if (!formData.businessName.trim()) {
            newErrors.businessName = 'Nama usaha wajib diisi.';
            isValid = false;
        }
        if (!formData.fundingAmount || Number(formData.fundingAmount) <= 0) {
            newErrors.fundingAmount = 'Jumlah dana harus angka positif.';
            isValid = false;
        }
        if (!formData.purpose.trim() || formData.purpose.length < 20) {
            newErrors.purpose = 'Tujuan pendanaan wajib diisi (minimal 20 karakter).';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
                <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">Pengajuan Terkirim!</h3>
                <p className="mt-2 text-gray-600">Terima kasih, pengajuan pendanaan Anda telah kami terima. Tim kami akan segera meninjau proposal Anda.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border space-y-6">
            <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>
            <div>
                <label htmlFor="fundingAmount" className="block text-sm font-medium text-gray-700">Jumlah Dana yang Diajukan (Rp)</label>
                <input type="number" id="fundingAmount" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} placeholder="Contoh: 50000000" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                {errors.fundingAmount && <p className="text-red-500 text-xs mt-1">{errors.fundingAmount}</p>}
            </div>
             <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Tujuan & Rencana Penggunaan Dana</label>
                <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-green-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-600 disabled:bg-green-300 flex items-center">
                    {isSubmitting && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
            </div>
        </form>
    );
};


const Pendanaan: React.FC = () => {
    const [selectedFunding, setSelectedFunding] = useState<FundingOption | null>(null);

    const fundingOptions: FundingOption[] = [
        {
            icon: 'account_balance',
            title: 'Kredit Usaha Rakyat (KUR)',
            provider: 'Bank Himbara & Bank Daerah',
            description: 'Program pembiayaan/kredit bersubsidi pemerintah dengan bunga rendah, untuk UMKM yang feasible namun belum bankable.',
            color: 'border-purple-500',
            image: 'https://picsum.photos/seed/kur/1200/400',
            detailedDescription: "Kredit Usaha Rakyat (KUR) adalah program prioritas pemerintah untuk mendukung UMKM dengan memberikan fasilitas kredit dengan suku bunga yang disubsidi. Program ini ditujukan bagi pelaku usaha yang memiliki usaha produktif dan layak (feasible) namun belum memiliki agunan yang cukup atau belum memenuhi persyaratan perbankan (unbankable).",
            benefits: ["Suku bunga rendah (sekitar 6% efektif per tahun)", "Jangka waktu pinjaman fleksibel dan panjang", "Persyaratan lebih mudah dibandingkan kredit komersial", "Meningkatkan kredibilitas usaha di mata perbankan"],
            requirements: ["Usaha telah aktif berjalan minimal 6 bulan.", "Memiliki Nomor Induk Berusaha (NIB) atau Surat Keterangan Usaha (SKU).", "Tidak sedang menerima kredit produktif dari perbankan lain.", "Dokumen identitas (KTP, KK, NPWP)."],
            process: [
                { title: "Persiapan Dokumen", description: "Siapkan semua dokumen persyaratan yang dibutuhkan seperti KTP, KK, NIB/SKU, dan NPWP." },
                { title: "Pengajuan ke Bank Penyalur", description: "Datang ke kantor cabang bank penyalur KUR terdekat (BRI, Mandiri, BNI, dll) dan ajukan permohonan." },
                { title: "Survei & Analisis", description: "Petugas bank akan melakukan survei ke lokasi usaha Anda untuk memverifikasi kelayakan usaha." },
                { title: "Akad Kredit & Pencairan", description: "Jika disetujui, Anda akan menandatangani akad kredit dan dana akan dicairkan ke rekening Anda." }
            ]
        },
        {
            icon: 'groups',
            title: 'Peer-to-Peer (P2P) Lending',
            provider: 'Platform Fintech Terdaftar OJK',
            description: 'Alternatif pendanaan modern yang menghubungkan UMKM langsung dengan investor melalui platform digital. Proses cepat dan mudah.',
            color: 'border-green-500',
            image: 'https://picsum.photos/seed/p2p/1200/400',
            detailedDescription: "P2P Lending adalah inovasi di bidang teknologi finansial (fintech) yang mempertemukan langsung antara peminjam (UMKM) dengan pemberi pinjaman (investor) melalui platform online. Ini menjadi alternatif bagi UMKM yang membutuhkan dana cepat tanpa melalui proses perbankan yang panjang.",
            benefits: ["Proses pengajuan 100% online dan cepat (beberapa hari kerja)", "Syarat lebih fleksibel, seringkali tanpa agunan fisik", "Jangkauan investor yang luas", "Meningkatkan skor kredit digital"],
            requirements: ["Usaha berjalan dengan cash flow yang tercatat.", "Laporan keuangan atau rekening koran 3-6 bulan terakhir.", "Identitas diri (KTP) dan legalitas usaha (NIB).", "Terdaftar di platform P2P Lending yang berizin OJK."],
            process: [
                { title: "Pilih Platform & Registrasi", description: "Pilih platform P2P yang terdaftar di OJK dan lakukan pendaftaran secara online." },
                { title: "Unggah Dokumen", description: "Lengkapi profil Anda dan unggah semua dokumen yang disyaratkan oleh platform." },
                { title: "Penilaian Kredit (Scoring)", description: "Platform akan menganalisis data Anda untuk menentukan tingkat risiko dan kelayakan pinjaman." },
                { title: "Kampanye Pendanaan & Pencairan", description: "Jika disetujui, pengajuan Anda akan ditawarkan kepada para investor. Dana akan cair setelah target pendanaan terpenuhi." }
            ]
        },
        {
            icon: 'rocket_launch',
            title: 'Modal Ventura',
            provider: 'Perusahaan Modal Ventura',
            description: 'Pendanaan ekuitas untuk bisnis dengan potensi pertumbuhan tinggi. Mitra strategis untuk akselerasi bisnis.',
            color: 'border-orange-500',
            image: 'https://picsum.photos/seed/ventura/1200/400',
            detailedDescription: "Modal Ventura (Venture Capital) adalah bentuk pendanaan privat di mana investor (VC) memberikan modal kepada perusahaan rintisan (startup) atau usaha yang sedang berkembang (scale-up) yang diyakini memiliki potensi pertumbuhan jangka panjang yang tinggi. Sebagai imbalannya, VC akan mengambil sebagian kepemilikan saham (ekuitas) di perusahaan tersebut.",
            benefits: ["Mendapatkan suntikan dana dalam jumlah besar", "Bimbingan dan mentoring dari para ahli industri", "Akses ke jaringan bisnis dan koneksi investor", "Dukungan strategis untuk pertumbuhan cepat"],
            requirements: ["Model bisnis yang inovatif, unik, dan scalable (dapat berkembang pesat).", "Tim pendiri yang solid dan kompeten.", "Produk atau layanan yang sudah memiliki traksi atau validasi pasar.", "Proyeksi pertumbuhan bisnis yang menjanjikan."],
            process: [
                { title: "Buat Pitch Deck", description: "Susun presentasi yang menarik berisi model bisnis, tim, traksi, dan proyeksi keuangan Anda." },
                { title: "Hubungi VC", description: "Cari dan hubungi perusahaan modal ventura yang memiliki fokus investasi di sektor bisnis Anda." },
                { title: "Pitching & Due Diligence", description: "Presentasikan bisnis Anda. Jika VC tertarik, mereka akan melakukan pemeriksaan mendalam (due diligence)." },
                { title: "Negosiasi & Pendanaan", description: "Negosiasi mengenai valuasi, jumlah saham, dan syarat lainnya. Jika sepakat, dana akan diinvestasikan." }
            ]
        },
        {
            icon: 'handshake',
            title: 'Program Kemitraan',
            provider: 'BUMN & Perusahaan Swasta',
            description: 'Program dana bergulir dari BUMN atau CSR perusahaan swasta untuk pembinaan dan pengembangan usaha kecil.',
            color: 'border-cyan-500',
            image: 'https://picsum.photos/seed/kemitraan/1200/400',
            detailedDescription: "Program Kemitraan adalah skema pendanaan yang biasanya dijalankan oleh Badan Usaha Milik Negara (BUMN) atau perusahaan swasta besar melalui program Corporate Social Responsibility (CSR). Tujuannya adalah untuk memberdayakan usaha kecil di sekitar wilayah operasi mereka. Pendanaan ini seringkali berupa pinjaman lunak (bunga sangat rendah) dan disertai dengan program pembinaan.",
            benefits: ["Bunga sangat rendah, bahkan bisa tanpa bunga", "Mendapatkan program pelatihan dan pendampingan usaha", "Kesempatan untuk menjadi pemasok bagi perusahaan besar", "Membangun relasi bisnis yang kuat"],
            requirements: ["Termasuk dalam kategori usaha yang menjadi target program.", "Memenuhi kriteria yang ditetapkan oleh perusahaan (misal: omzet tahunan di bawah batas tertentu).", "Berdomisili di wilayah operasi perusahaan.", "Lolos proses seleksi dan verifikasi yang ketat."],
            process: [
                { title: "Cari Informasi Program", description: "Pantau informasi pembukaan program kemitraan di website resmi BUMN atau perusahaan terkait." },
                { title: "Ajukan Proposal", description: "Kirimkan proposal usaha Anda sesuai dengan persyaratan yang diminta saat pendaftaran dibuka." },
                { title: "Proses Seleksi", description: "Tim akan melakukan seleksi administratif dan survei lapangan terhadap proposal yang masuk." },
                { title: "Menjadi Mitra Binaan", description: "Jika lolos, Anda akan menjadi mitra binaan, menandatangani perjanjian, dan menerima dana serta program pembinaan." }
            ]
        }
    ];

    const handleSelectFunding = (funding: FundingOption) => {
        setSelectedFunding(funding);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setSelectedFunding(null);
    };

    if (selectedFunding) {
        return <FundingDetailView funding={selectedFunding} onBack={handleBackToList} />;
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle
                title="Akses Pendanaan untuk UMKM"
                subtitle="Temukan berbagai sumber permodalan untuk mendukung pertumbuhan dan ekspansi bisnis Anda."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {fundingOptions.map(option => (
                    <FundingCard key={option.title} {...option} onSelect={() => handleSelectFunding(option)} />
                ))}
            </div>

            <section className="mt-20">
                <SectionTitle
                    title="Ajukan Pendanaan Anda"
                    subtitle="Isi formulir singkat di bawah ini untuk memulai proses pengajuan pendanaan melalui platform kami."
                />
                <div className="max-w-2xl mx-auto mt-12">
                    <FundingApplicationForm />
                </div>
            </section>
        </div>
    );
};

export default Pendanaan;