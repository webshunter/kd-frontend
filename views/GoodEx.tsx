import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

// --- TYPES ---
interface Service {
    icon: string;
    title: string;
    description: string;
    image: string;
    detailedDescription: string;
    benefits: string[];
    process: { title: string; description: string }[];
}

// --- CHILD COMPONENTS ---

const ServiceDetailView: React.FC<{ service: Service; onBack: () => void; }> = ({ service, onBack }) => (
    <div className="animate-fade-in">
        <div className="container mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-teal-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Layanan
            </button>
        </div>

        {/* Hero Section for the service */}
        <section className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${service.image}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
            <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white">{service.title}</h1>
            </div>
        </section>
        
        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-200 pb-2">Tentang Layanan Ini</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.detailedDescription}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-teal-200 pb-2">Proses Layanan</h2>
                        <div className="space-y-8 relative">
                            {/* Vertical line */}
                            <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-gray-200"></div>
                            {service.process.map((step, index) => (
                                <div key={index} className="relative flex items-start space-x-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg z-10">
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
                            <span className="material-symbols-outlined text-green-500 mr-3">verified</span>
                            Manfaat untuk UMKM
                        </h3>
                        <ul className="space-y-3">
                            {service.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="material-symbols-outlined text-green-500 !text-xl mr-2 mt-0.5">check_circle</span>
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-8 bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition duration-300">
                            Mulai Konsultasi
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    </div>
);


const ServiceCard: React.FC<{ service: Service; onClick: () => void; }> = ({ service, onClick }) => (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-transparent hover:border-teal-500 hover:shadow-lg transition-all duration-300 flex items-start space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
        <div className="flex-shrink-0">
             <div className="bg-teal-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-3xl text-teal-600">{service.icon}</span>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
        </div>
    </div>
);


const GoodEx: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const services: Service[] = [
        {
            icon: 'verified',
            title: 'Kurasi Produk Ekspor',
            description: 'Seleksi dan pendampingan untuk memastikan produk Anda memenuhi standar kualitas pasar internasional.',
            image: 'https://picsum.photos/seed/kurasi/1200/400',
            detailedDescription: "Layanan Kurasi Produk Ekspor adalah gerbang utama Anda menuju pasar global. Tim ahli kami akan melakukan evaluasi mendalam terhadap produk Anda, mencakup aspek kualitas, keamanan pangan (jika relevan), desain kemasan, hingga pemenuhan standar sertifikasi internasional seperti HACCP, ISO, atau label organik. Kami tidak hanya menilai, tetapi juga memberikan rekomendasi perbaikan konkret dan pendampingan agar produk Anda siap bersaing dan diterima oleh konsumen di negara tujuan.",
            benefits: ["Meningkatkan Daya Saing Produk", "Memenuhi Standar Internasional", "Membangun Kepercayaan Buyer", "Mengurangi Risiko Penolakan Produk"],
            process: [
                { title: "Pendaftaran & Pengiriman Sampel", description: "Daftarkan produk Anda dan kirimkan sampel untuk dievaluasi." },
                { title: "Evaluasi Komprehensif", description: "Tim kami akan melakukan penilaian multi-aspek terhadap produk dan kemasan." },
                { title: "Laporan & Rekomendasi", description: "Anda akan menerima laporan hasil kurasi beserta saran perbaikan yang actionable." },
                { title: "Pendampingan Perbaikan", description: "Kami akan mendampingi Anda dalam proses perbaikan hingga produk dinyatakan 'Export-Ready'." }
            ]
        },
        {
            icon: 'travel_explore',
            title: 'Riset Pasar Global',
            description: 'Analisis mendalam mengenai potensi pasar, tren konsumen, dan kompetitor di negara tujuan.',
            image: 'https://picsum.photos/seed/riset/1200/400',
            detailedDescription: "Jangan memasuki pasar baru secara buta. Layanan Riset Pasar Global kami menyediakan data dan wawasan strategis untuk membantu Anda membuat keputusan yang tepat. Kami akan menganalisis tren konsumen, ukuran pasar potensial, lanskap kompetitor, regulasi impor di negara tujuan, serta preferensi harga dan distribusi. Hasil riset ini akan menjadi fondasi kuat untuk menyusun strategi pemasaran dan penjualan yang efektif.",
            benefits: ["Memahami Target Pasar", "Mengurangi Risiko Kegagalan", "Mengidentifikasi Peluang Baru", "Strategi Pemasaran Tepat Sasaran"],
            process: [
                { title: "Konsultasi Awal", description: "Diskusikan produk dan target negara yang Anda inginkan." },
                { title: "Pengumpulan Data", description: "Tim kami akan mengumpulkan data primer dan sekunder dari berbagai sumber terpercaya." },
                { title: "Analisis & Penyusunan Laporan", description: "Data diolah menjadi wawasan strategis yang mudah dipahami." },
                { title: "Presentasi Hasil", description: "Kami akan mempresentasikan hasil riset dan memberikan sesi tanya jawab." }
            ]
        },
        {
            icon: 'handshake',
            title: 'Business Matching Internasional',
            description: 'Menghubungkan Anda dengan jaringan pembeli (buyer), distributor, dan agen potensial di luar negeri.',
            image: 'https://picsum.photos/seed/matching/1200/400',
            detailedDescription: "Menemukan buyer yang tepat adalah kunci sukses ekspor. Melalui jaringan global yang kami miliki, layanan Business Matching Internasional akan menghubungkan Anda secara langsung dengan calon pembeli, distributor, agen, atau importir yang relevan dengan produk Anda. Kami memfasilitasi proses perkenalan, mengatur pertemuan (virtual atau fisik), dan membantu negosiasi awal untuk membangun hubungan bisnis yang saling menguntungkan.",
            benefits: ["Akses Jaringan Buyer Global", "Proses Lebih Cepat & Efisien", "Meningkatkan Kredibilitas", "Peluang Kontrak Jangka Panjang"],
            process: [
                { title: "Pembuatan Profil Usaha", description: "Kami bantu menyusun profil usaha dan katalog produk Anda dalam standar internasional." },
                { title: "Pencarian Mitra Potensial", description: "Tim kami akan mencari dan menyeleksi calon mitra yang sesuai dari database kami." },
                { title: "Pengaturan Pertemuan", description: "Kami akan mengatur jadwal pertemuan online atau offline antara Anda dan calon buyer." },
                { title: "Pendampingan Negosiasi", description: "Memberikan dukungan selama proses negosiasi awal." }
            ]
        },
        {
            icon: 'description',
            title: 'Pendampingan Regulasi & Dokumen',
            description: 'Bantuan pengurusan dokumen ekspor seperti PEB, Certificate of Origin (COO), dan perizinan lainnya.',
            image: 'https://picsum.photos/seed/dokumen/1200/400',
            detailedDescription: "Proses administrasi ekspor bisa menjadi rumit dan memakan waktu. Tim kami siap memberikan pendampingan penuh dalam pengurusan berbagai dokumen esensial, seperti Pemberitahuan Ekspor Barang (PEB), Certificate of Origin (COO) atau Surat Keterangan Asal (SKA), Health Certificate, dan dokumen lain yang disyaratkan oleh negara tujuan. Kami memastikan semua dokumen Anda lengkap dan sesuai dengan peraturan yang berlaku untuk kelancaran proses pengiriman.",
            benefits: ["Proses Ekspor Lancar & Cepat", "Menghindari Kesalahan Administrasi", "Memastikan Kepatuhan Regulasi", "Menghemat Waktu & Tenaga"],
            process: [
                { title: "Identifikasi Kebutuhan Dokumen", description: "Menentukan dokumen apa saja yang diperlukan berdasarkan produk dan negara tujuan." },
                { title: "Bantuan Pengisian Formulir", description: "Membantu Anda dalam mengisi formulir dan melengkapi persyaratan." },
                { title: "Koordinasi dengan Instansi Terkait", description: "Berkoordinasi dengan Bea Cukai, Dinas Perdagangan, dan instansi lainnya." },
                { title: "Finalisasi Dokumen", description: "Memastikan semua dokumen siap sebelum barang dikirim." }
            ]
        },
        {
            icon: 'campaign',
            title: 'Promosi & Pameran Dagang',
            description: 'Mengikutsertakan produk Anda dalam pameran dagang internasional, baik secara fisik maupun virtual.',
            image: 'https://picsum.photos/seed/pameran-ex/1200/400',
            detailedDescription: "Tampilkan produk unggulan Anda di panggung dunia. Kami memberikan kesempatan bagi UMKM terpilih untuk berpartisipasi dalam pameran dagang internasional bergengsi. Kami akan mengurus semua kebutuhan, mulai dari desain booth, logistik pengiriman sampel, hingga materi promosi. Selain pameran fisik, kami juga memfasilitasi partisipasi dalam pameran virtual untuk menjangkau audiens yang lebih luas dengan biaya yang lebih efisien.",
            benefits: ["Meningkatkan Brand Exposure", "Bertemu Langsung dengan Buyer", "Mendapatkan Feedback Pasar", "Melihat Tren & Kompetitor"],
            process: [
                { title: "Kurasi Peserta Pameran", description: "Seleksi UMKM yang paling siap untuk mengikuti pameran." },
                { title: "Persiapan Pra-Pameran", description: "Pelatihan, persiapan materi promosi, dan desain booth." },
                { title: "Pelaksanaan Pameran", description: "Pendampingan penuh selama acara berlangsung." },
                { title: "Tindak Lanjut Pasca-Pameran", description: "Membantu menindaklanjuti prospek yang didapat selama pameran." }
            ]
        },
        {
            icon: 'school',
            title: 'Pelatihan & Edukasi Ekspor',
            description: 'Program pelatihan intensif mengenai prosedur ekspor, logistik, dan metode pembayaran internasional.',
            image: 'https://picsum.photos/seed/edukasi/1200/400',
            detailedDescription: "Bekali diri Anda dengan pengetahuan dan keterampilan yang dibutuhkan untuk menjadi eksportir andal. Program pelatihan kami mencakup semua aspek penting dalam bisnis ekspor, mulai dari prosedur kepabeanan, strategi mencari buyer, metode pembayaran internasional (L/C, T/T), perhitungan harga ekspor (Incoterms), hingga strategi pemasaran digital untuk pasar global. Materi disampaikan oleh praktisi ekspor berpengalaman.",
            benefits: ["Memahami Alur Ekspor dari A-Z", "Meningkatkan Kepercayaan Diri", "Mengurangi Risiko Kesalahan", "Membangun Strategi yang Solid"],
            process: [
                { title: "Pilih Modul Pelatihan", description: "Pilih kelas yang sesuai dengan kebutuhan Anda, dari level pemula hingga mahir." },
                { title: "Ikuti Sesi Interaktif", description: "Belajar melalui sesi online atau offline dengan studi kasus dan diskusi." },
                { title: "Dapatkan Materi & Sertifikat", description: "Akses materi pembelajaran dan dapatkan sertifikat setelah menyelesaikan kursus." },
                { title: "Konsultasi Pasca-Pelatihan", description: "Sesi konsultasi untuk membantu menerapkan ilmu yang didapat." }
            ]
        },
        {
            icon: 'local_shipping',
            title: 'Solusi Logistik & Pengiriman',
            description: 'Kerja sama dengan mitra logistik terpercaya untuk memastikan pengiriman yang efisien, aman, dan tepat waktu.',
            image: 'https://picsum.photos/seed/logistik/1200/400',
            detailedDescription: "Pengiriman barang ke luar negeri memerlukan penanganan khusus. Kami telah bermitra dengan perusahaan forwarder dan logistik terpercaya untuk memberikan solusi pengiriman yang efisien dan aman. Kami akan membantu Anda memilih moda transportasi terbaik (laut atau udara), mengurus proses customs clearance, dan memastikan barang Anda tiba di tujuan dengan selamat dan tepat waktu. Dapatkan penawaran harga kompetitif melalui jaringan kami.",
            benefits: ["Harga Pengiriman Kompetitif", "Proses Pengiriman Aman & Terlacak", "Pilihan Moda Transportasi Fleksibel", "Penanganan Profesional"],
            process: [
                { title: "Permintaan Penawaran Harga", description: "Berikan detail barang dan tujuan pengiriman Anda." },
                { title: "Penerimaan Opsi & Harga", description: "Kami akan memberikan beberapa opsi pengiriman dari mitra kami." },
                { title: "Penjadwalan Penjemputan", description: "Atur jadwal penjemputan barang dari lokasi Anda." },
                { title: "Pelacakan Pengiriman", description: "Pantau status pengiriman Anda melalui sistem pelacakan online." }
            ]
        },
        {
            icon: 'palette',
            title: 'Konsultasi Desain & Kemasan',
            description: 'Membantu mengadaptasi desain produk dan kemasan agar sesuai dengan selera dan regulasi pasar tujuan.',
            image: 'https://picsum.photos/seed/desain/1200/400',
            detailedDescription: "Kemasan produk Anda harus 'berbicara' dalam bahasa yang dimengerti oleh pasar global. Layanan konsultasi kami akan membantu Anda mengadaptasi desain produk dan kemasan agar tidak hanya menarik secara visual, tetapi juga fungsional dan sesuai dengan regulasi pelabelan di negara tujuan. Kami akan memberikan masukan mengenai pilihan warna, tipografi, material, dan informasi yang wajib dicantumkan pada kemasan ekspor.",
            benefits: ["Desain yang Menarik Konsumen Global", "Memenuhi Regulasi Pelabelan", "Meningkatkan Persepsi Kualitas", "Kemasan yang Aman untuk Pengiriman"],
            process: [
                { title: "Analisis Kemasan Saat Ini", description: "Evaluasi desain kemasan Anda yang sudah ada." },
                { title: "Sesi Brainstorming & Konsep", description: "Diskusi ide dan konsep desain baru yang sesuai dengan target pasar." },
                { title: "Rekomendasi Desainer/Vendor", description: "Menghubungkan Anda dengan desainer grafis atau vendor percetakan yang berpengalaman." },
                { title: "Review Desain Final", description: "Memberikan masukan akhir sebelum desain masuk ke tahap produksi." }
            ]
        }
    ];

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
        setView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setSelectedService(null);
        setView('list');
    };

    if (view === 'detail' && selectedService) {
        return <ServiceDetailView service={selectedService} onBack={handleBackToList} />;
    }

    return (
        <div className="animate-fade-in">
            <div className="container mx-auto px-6 py-12">
                <SectionTitle 
                    title="GoodEx - Bawa Bisnis Anda ke Pasar Global"
                    subtitle="Kami adalah fasilitator ekspor terpadu yang siap membantu UMKM Tangerang Selatan menembus panggung dunia."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map(service => (
                        <ServiceCard key={service.title} service={service} onClick={() => handleServiceClick(service)} />
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="mt-20 p-8 md:p-12 bg-teal-600 rounded-lg text-white text-center">
                    <h2 className="text-3xl font-extrabold">Siap Menjangkau Dunia?</h2>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-teal-100">Jangan biarkan batas negara menghalangi pertumbuhan bisnis Anda. Ambil langkah pertama Anda menuju pasar global hari ini.</p>
                    <button className="mt-8 bg-white text-teal-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-lg transform hover:scale-105 shadow-lg">
                        Mulai Konsultasi Ekspor (Gratis)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoodEx;