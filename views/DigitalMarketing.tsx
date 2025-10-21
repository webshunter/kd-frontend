import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

const ServiceCard: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-cyan-500 hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="flex items-center space-x-4 mb-3">
            <div className="bg-cyan-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-3xl text-cyan-600">{icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </div>
);

const StepCard: React.FC<{ step: number; title: string; description: string; }> = ({ step, title, description }) => (
    <div className="relative pl-12">
        <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold text-lg">
            {step}
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 font-semibold text-gray-800 hover:bg-gray-50 px-2"
            >
                <span>{question}</span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 pt-0 text-gray-600">{answer}</p>
            </div>
        </div>
    );
};

const DigitalMarketing: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative text-white py-20 md:py-32 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1600/900?random=35')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-800/80 to-blue-600/70"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                        Maksimalkan Potensi Bisnis Anda di Dunia Digital
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto">
                        Layanan Digital Marketing terpadu untuk UMKM Tangsel. Jangkau lebih banyak pelanggan dan tingkatkan penjualan Anda.
                    </p>
                    <button className="bg-orange-500 text-white font-bold py-4 px-10 rounded-full hover:bg-orange-600 transition duration-300 text-lg transform hover:scale-105">
                        Dapatkan Konsultasi Gratis
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <SectionTitle
                        title="Layanan Pemasaran Digital Kami"
                        subtitle="Kami menyediakan solusi lengkap untuk membantu bisnis Anda tumbuh secara online, dari media sosial hingga iklan berbayar."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
                        <ServiceCard
                            icon="groups"
                            title="Manajemen Media Sosial"
                            description="Pembuatan konten terjadwal, interaksi dengan audiens, dan pengelolaan akun Instagram, Facebook, & TikTok untuk membangun komunitas yang loyal."
                        />
                        <ServiceCard
                            icon="campaign"
                            title="Iklan Digital (Ads)"
                            description="Menjalankan kampanye iklan yang tertarget di Facebook Ads dan Instagram Ads untuk menjangkau calon pelanggan yang tepat dan meningkatkan konversi."
                        />
                        <ServiceCard
                            icon="travel_explore"
                            title="Optimisasi SEO Lokal"
                            description="Meningkatkan visibilitas bisnis Anda di Google Maps dan pencarian lokal agar lebih mudah ditemukan oleh pelanggan di sekitar Tangerang Selatan."
                        />
                        <ServiceCard
                            icon="camera_alt"
                            title="Produksi Konten Kreatif"
                            description="Jasa fotografi dan videografi produk profesional untuk menciptakan materi promosi yang menarik dan berkualitas tinggi."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <SectionTitle
                        title="Bagaimana Kami Bekerja"
                        subtitle="Proses kami sederhana dan transparan, dirancang untuk memberikan hasil yang maksimal bagi bisnis Anda."
                    />
                    <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-10 relative">
                             <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-gray-200 -z-10"></div>
                             <StepCard step={1} title="Konsultasi & Analisis" description="Kami memahami tujuan bisnis, target pasar, dan tantangan yang Anda hadapi." />
                             <StepCard step={2} title="Perancangan Strategi" description="Menyusun rencana pemasaran digital yang disesuaikan dengan anggaran dan target Anda." />
                             <StepCard step={3} title="Eksekusi & Optimisasi" description="Menjalankan kampanye, membuat konten, dan terus memantau performa untuk hasil terbaik." />
                             <StepCard step={4} title="Pelaporan & Evaluasi" description="Memberikan laporan bulanan yang mudah dipahami mengenai kinerja dan ROI kampanye." />
                         </div>
                         <div>
                            <img src="https://picsum.photos/seed/marketing/600/800" alt="Digital Marketing Process" className="rounded-lg shadow-xl" />
                         </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <SectionTitle
                        title="Pertanyaan Umum (FAQ)"
                        subtitle="Jawaban atas pertanyaan yang sering diajukan mengenai layanan pemasaran digital kami."
                    />
                    <div className="max-w-3xl mx-auto mt-8 bg-white p-4 rounded-lg shadow-md">
                        <FaqItem question="Berapa biaya layanan digital marketing?" answer="Biaya layanan kami sangat fleksibel dan disesuaikan dengan kebutuhan serta anggaran UMKM Anda. Kami memiliki paket bulanan mulai dari Rp 500.000 untuk manajemen media sosial dasar." />
                        <FaqItem question="Apakah ada jaminan penjualan akan meningkat?" answer="Meskipun tidak ada yang bisa menjamin peningkatan penjualan secara pasti, strategi kami dirancang untuk meningkatkan visibilitas, jangkauan, dan interaksi dengan target pelanggan Anda, yang secara langsung berkorelasi dengan potensi peningkatan penjualan." />
                        <FaqItem question="Apakah saya perlu menyediakan materi konten sendiri?" answer="Tidak harus. Paket kami mencakup pembuatan konten dasar. Namun, jika Anda memiliki foto atau video produk, itu akan sangat membantu. Kami juga menyediakan jasa produksi konten profesional sebagai layanan tambahan." />
                        <FaqItem question="Berapa lama kontrak kerjasamanya?" answer="Kami menawarkan kontrak yang fleksibel, mulai dari 3 bulan hingga 1 tahun. Kami merekomendasikan minimal 3 bulan untuk melihat hasil yang signifikan dari upaya pemasaran digital." />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigitalMarketing;
