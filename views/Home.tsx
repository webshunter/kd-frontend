import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { FEATURES, ALL_NEWS_ARTICLES } from '../constants';
import FeatureCard from '../components/FeatureCard';
import SectionTitle from '../components/SectionTitle';
import NewsCard from '../components/NewsCard';

interface HomeProps {
  setCurrentView: (view: View) => void;
}

const programSlides = [
  {
    title: "TangselMart",
    subtitle: "Dukung Produk Lokal",
    description: "Jelajahi marketplace lokal kami, temukan produk unik dari UMKM Tangsel, dan dukung pertumbuhan ekonomi daerah.",
    buttonText: "Belanja Sekarang",
    buttonView: View.TangselMart,
    image: "https://picsum.photos/800/600?random=31",
    color: "orange",
  },
  {
    title: "GoodSkill Tangsel",
    subtitle: "Tingkatkan Keahlian Anda",
    description: "Akses kursus online berkualitas untuk memajukan diri dan usaha Anda. Dari pemasaran digital hingga manajemen keuangan.",
    buttonText: "Mulai Belajar",
    buttonView: View.GoodSkill,
    image: "https://picsum.photos/800/600?random=32",
    color: "green",
  },
  {
    title: "HalloHukum",
    subtitle: "Konsultasi Legal Mudah",
    description: "Dapatkan kemudahan akses konsultasi hukum untuk UMKM. Urus legalitas usaha Anda dengan bantuan AI Legal Advisor kami.",
    buttonText: "Konsultasi Sekarang",
    buttonView: View.HalloHukum,
    image: "https://picsum.photos/800/600?random=33",
    color: "red",
  },
];

const forumThreads = [
    { title: 'Cara Foto Produk Keren Pakai HP Saja', author: 'Joko Anwar', replies: 22, topic: 'Tips & Trik UMKM' },
    { title: 'Aplikasi Kasir Gratis yang Recommended?', author: 'Agus Setiawan', replies: 15, topic: 'Tips & Trik UMKM' },
    { title: 'Info Bazaar UMKM di Bintaro Weekend Ini', author: 'Lestari Indah', replies: 18, topic: 'Acara & Komunitas Lokal' },
    { title: 'Kolaborasi Desain Kemasan Produk Kopi', author: 'Kopi Senja Tangsel', replies: 12, topic: 'Peluang Usaha' },
];

const membershipPackages = [
    {
        icon: "person",
        title: "UMKM Digital",
        price: "Gratis",
        description: "Untuk individu dan penggiat komunitas yang ingin terhubung.",
        features: [
            { text: "Akses ke Forum Diskusi", included: true },
            { text: "Informasi Event & Berita", included: true },
            { text: "Direktori UMKM (melihat)", included: true },
            { text: "Dasbor Profil Dasar", included: false },
            { text: "Mendaftarkan Produk di TangselMart", included: false },
            { text: "Akses Kursus GoodSkill Premium", included: false },
            { text: "Akses Mentoring Bisnis", included: false },
        ],
        ctaText: "Daftar Gratis",
        detailsAction: "Lihat Detail",
        popular: false,
        targetAudience: "Individu, pelajar, mahasiswa, atau masyarakat umum yang tertarik dengan ekosistem UMKM dan komunitas di Tangerang Selatan.",
        detailedDescription: "Paket UMKM Digital adalah gerbang Anda untuk masuk ke dalam ekosistem digital Tangsel. Dapatkan akses ke informasi terkini, berpartisipasi dalam diskusi komunitas, dan jelajahi direktori UMKM lokal. Paket ini gratis dan cocok bagi siapa saja yang ingin terhubung dan belajar lebih banyak tentang potensi ekonomi lokal."
    },
    {
        icon: "rocket_launch",
        title: "UMKM Juara",
        price: 100,
        priceUnit: "rb",
        priceSuffix: "/ bulan",
        description: "Paket lengkap untuk UMKM yang ingin tumbuh dan go digital.",
        features: [
            { text: "Semua fitur Warga Digital", included: true },
            { text: "Dasbor Profil Usaha Lengkap", included: true },
            { text: "Mendaftarkan Produk di TangselMart", included: true },
            { text: "Akses Semua Kursus GoodSkill", included: true },
            { text: "Slot Prioritas Mentoring Bisnis", included: true },
            { text: "Akses Business Matching", included: true },
            { text: "Laporan Analitik Penjualan", included: true },
        ],
        ctaText: "Pilih Paket",
        detailsAction: "Lihat Detail",
        popular: true,
        targetAudience: "Pelaku UMKM yang serius ingin mengembangkan usahanya, meningkatkan penjualan, dan memperluas jaringan melalui platform digital.",
        detailedDescription: "UMKM Juara adalah paket akselerator bisnis Anda. Dengan paket ini, Anda tidak hanya terdaftar, tetapi juga mendapatkan perangkat lengkap untuk berjualan online, meningkatkan keahlian, mendapatkan bimbingan dari mentor, dan menemukan mitra bisnis baru. Ini adalah investasi terbaik untuk membawa usaha Anda ke level selanjutnya dan menjadi juara di pasar digital."
    },
     {
        icon: "public",
        title: "UMKM Global",
        price: 500,
        priceUnit: "rb",
        priceSuffix: "/ bulan",
        description: "Untuk UMKM yang siap menembus pasar internasional dan ekspor.",
        features: [
            { text: "Semua fitur UMKM Juara", included: true },
            { text: "Akses Penuh ke Program GoodEx", included: true },
            { text: "Konsultasi Ekspor Prioritas", included: true },
            { text: "Promosi di Pameran Internasional", included: true },
            { text: "Bantuan Dokumentasi Ekspor", included: true },
            { text: "Laporan Tren Pasar Global", included: true },
            { text: "Dukungan Manajer Akun Khusus", included: false },
        ],
        ctaText: "Go Global",
        detailsAction: "Lihat Detail",
        popular: false,
        targetAudience: "UMKM yang memiliki produk berkualitas ekspor dan berambisi untuk memperluas pasar ke kancah internasional.",
        detailedDescription: "Paket UMKM Global adalah paspor Anda menuju pasar dunia. Kami menyediakan dukungan end-to-end melalui program GoodEx, mulai dari kurasi produk, riset pasar, hingga business matching dengan buyer internasional. Jika Anda memiliki produk unggulan dan mimpi besar untuk go international, paket ini adalah mitra strategis yang Anda butuhkan."
    },
    {
        icon: "business_center",
        title: "UMKM Korporasi",
        price: "Kustom",
        description: "Untuk perusahaan atau institusi yang mencari kemitraan strategis.",
        features: [
            { text: "Semua fitur UMKM Juara", included: true },
            { text: "Branding di Halaman Utama", included: true },
            { text: "Akses API Terintegrasi", included: true },
            { text: "Program CSR Terkelola", included: true },
            { text: "Event Kolaborasi Khusus", included: true },
            { text: "Laporan Data Agregat", included: true },
            { text: "Dukungan Manajer Akun Khusus", included: true },
        ],
        ctaText: "Hubungi Kami",
        detailsAction: "Lihat Detail",
        popular: false,
        targetAudience: "Perusahaan besar, BUMN, atau institusi yang ingin berkolaborasi dengan ekosistem UMKM, menjalankan program CSR, atau mencari data dan wawasan ekonomi lokal.",
        detailedDescription: "Paket Korporasi dirancang untuk kemitraan strategis. Kami menawarkan berbagai peluang kolaborasi, mulai dari program co-branding, integrasi data melalui API, hingga pengelolaan program CSR yang berdampak bagi komunitas UMKM. Hubungi tim kami untuk mendiskusikan bagaimana kita bisa bertumbuh bersama dan menciptakan dampak positif yang lebih besar."
    },
];

type MembershipPackage = typeof membershipPackages[0];

const PackageDetailView: React.FC<{ apackage: MembershipPackage, onBack: () => void, setCurrentView: (view: View) => void }> = ({ apackage, onBack, setCurrentView }) => {
    return (
        <div className="animate-fade-in bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold mb-6">
                    <span className="material-symbols-outlined mr-2">arrow_back</span>
                    Kembali ke Beranda
                </button>
            </div>
            
            <div className="container mx-auto px-6 pb-16">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                         <div className={`inline-block p-4 bg-blue-100 rounded-full mb-4`}>
                          <span className={`material-symbols-outlined text-5xl text-blue-600`}>{apackage.icon}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">{apackage.title}</h1>
                        <p className="text-xl text-gray-600 mt-2">{apackage.description}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                             <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Deskripsi Paket</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{apackage.detailedDescription}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Untuk Siapa Paket Ini?</h2>
                                <p className="text-gray-700 leading-relaxed">{apackage.targetAudience}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Fitur & Manfaat</h2>
                                <ul className="space-y-4">
                                    {apackage.features.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className={`material-symbols-outlined mt-0.5 text-lg flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                                                {feature.included ? 'check_circle' : 'cancel'}
                                            </span>
                                            <span className={`${!feature.included ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                             <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Harga Paket</h3>
                                 <div className="my-4 flex items-baseline justify-center h-16">
                                    {typeof apackage.price === 'string' ? (
                                        <span className="text-4xl font-extrabold text-gray-900">{apackage.price}</span>
                                    ) : (
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-2xl font-semibold text-gray-500 mr-1">Rp</span>
                                            <span className="text-5xl font-extrabold text-gray-900">{apackage.price}</span>
                                            <span className="ml-1 text-lg font-medium text-gray-500">{apackage.priceUnit}{apackage.priceSuffix}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setCurrentView(View.PaymentMembership)}
                                    className="w-full font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg mt-4 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {apackage.ctaText}
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ForumThreadCard: React.FC<{ thread: typeof forumThreads[0], onClick: () => void }> = ({ thread, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-lg border flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm">
        <div className="flex items-center space-x-4">
            <span className="material-symbols-outlined text-3xl text-gray-400">forum</span>
            <div>
                <h4 className="font-bold text-gray-800 text-md hover:text-blue-600">{thread.title}</h4>
                <p className="text-sm text-gray-500">oleh {thread.author} di topik <span className="font-medium text-gray-600">{thread.topic}</span></p>
            </div>
        </div>
        <div className="text-right hidden sm:block">
            <p className="font-semibold text-blue-600">{thread.replies}</p>
            <p className="text-sm text-gray-500">balasan</p>
        </div>
    </div>
);


const colorClasses = {
  orange: { bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-600', text: 'text-orange-500' },
  green: { bg: 'bg-green-500', hoverBg: 'hover:bg-green-600', text: 'text-green-500' },
  red: { bg: 'bg-red-500', hoverBg: 'hover:bg-red-600', text: 'text-red-500' },
};

const AnimatedNumber: React.FC<{ endValue: number }> = ({ endValue }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const duration = 1500; // 1.5 seconds animation

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 } // Start animation when 10% is visible
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        // Reset count when endValue changes, for safety
        setCount(0);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [endValue]);

    return <span ref={ref}>{count}</span>;
};


const Home: React.FC<HomeProps> = ({ setCurrentView }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const membershipSectionRef = useRef<HTMLDivElement>(null);
  const [isMembershipSectionVisible, setMembershipSectionVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackage | null>(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % programSlides.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for membership cards animation
  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setMembershipSectionVisible(true);
                observer.unobserve(entry.target); // Animate only once
            }
        },
        { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    const currentRef = membershipSectionRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }

    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, []);

  const handleViewPackage = (pkg: MembershipPackage) => {
    setSelectedPackage(pkg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedPackage) {
    return <PackageDetailView apackage={selectedPackage} onBack={() => setSelectedPackage(null)} setCurrentView={setCurrentView} />;
  }


  return (
    <div className="animate-fade-in">
      {/* Hero Program Carousel */}
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="relative h-[600px] md:h-[450px]">
            {programSlides.map((slide, index) => {
              const isActive = index === activeIndex;
              const slideColors = colorClasses[slide.color as keyof typeof colorClasses];
              return (
                <div 
                  key={slide.title}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={!isActive}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 h-full items-center">
                    {/* Content */}
                    <div className="flex flex-col justify-center text-center md:text-left">
                      <span className={`font-bold text-lg ${slideColors.text}`}>{slide.subtitle}</span>
                      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-2">{slide.title}</h1>
                      <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto md:mx-0">{slide.description}</p>
                      <button 
                        onClick={() => setCurrentView(slide.buttonView)}
                        className={`mt-8 self-center md:self-start text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg transform hover:scale-105 ${slideColors.bg} ${slideColors.hoverBg}`}
                      >
                        {slide.buttonText}
                      </button>
                    </div>
                    {/* Image */}
                    <div className="relative h-64 md:h-full">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
          {programSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? `bg-gray-800 w-6` : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Ekosistem Digital Terpadu"
            subtitle="Semua yang Anda butuhkan untuk tumbuh dan berkolaborasi di Tangerang Selatan, dalam satu platform."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} onClick={setCurrentView} />
            ))}
          </div>
        </div>
      </section>

      {/* Berita UMKM Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Berita UMKM Tangsel"
            subtitle="Ikuti perkembangan terbaru dari dunia UMKM di Tangerang Selatan."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {ALL_NEWS_ARTICLES.slice(0, 3).map((article, index) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onReadMoreClick={() => setCurrentView(View.Berita)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Forum Discussion Section */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <SectionTitle 
                    title="Forum Diskusi Terkini"
                    subtitle="Bergabunglah dalam percakapan, bagikan pengetahuan, dan temukan solusi bersama komunitas."
                />
                <div className="max-w-4xl mx-auto mt-12 space-y-4">
                    {forumThreads.map((thread, index) => (
                        <ForumThreadCard key={index} thread={thread} onClick={() => setCurrentView(View.Forum)} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button 
                        onClick={() => setCurrentView(View.Forum)} 
                        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 text-lg border border-blue-200 shadow-sm"
                    >
                        Kunjungi Forum
                    </button>
                </div>
            </div>
        </section>
      
        {/* Membership Packages Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle
                    title="Paket Layanan Membership"
                    subtitle="Pilih paket yang paling sesuai dengan kebutuhan dan skala usaha Anda untuk memaksimalkan manfaat."
                />
                <div ref={membershipSectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 items-stretch">
                    {membershipPackages.map((pkg, index) => {
                       const isPopular = pkg.popular;
                       
                       const cardClasses = `relative flex flex-col bg-white rounded-2xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl h-full border ${isPopular ? 'border-blue-500' : 'border-gray-200'} cursor-pointer`;
                       
                       const ctaButtonClasses = `w-full font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg mt-4 ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`;
                       
                        return (
                            <div 
                                key={index} 
                                className={`transform transition-all duration-500 ease-out ${isMembershipSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isPopular ? 'lg:scale-105' : 'hover:lg:-translate-y-2'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className={cardClasses} onClick={() => handleViewPackage(pkg)}>
                                    {isPopular && (
                                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase shadow-md z-10">
                                            Paling Populer
                                        </div>
                                    )}
                                    
                                    <div className="text-center pt-4">
                                        <div className={`inline-block p-3 ${isPopular ? 'bg-blue-50' : 'bg-gray-100'} rounded-full mb-4`}>
                                          <span className={`material-symbols-outlined text-3xl ${isPopular ? 'text-blue-600' : 'text-gray-600'}`}>{pkg.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>
                                        <p className="text-gray-500 mt-2 h-12">{pkg.description}</p>
                                    </div>
                                    
                                    <div className="my-8 flex items-baseline justify-center h-16">
                                        {typeof pkg.price === 'string' ? (
                                            <span className="text-3xl font-extrabold text-gray-900">{pkg.price}</span>
                                        ) : (
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-xl font-semibold text-gray-500 mr-1">Rp</span>
                                                <span className="text-4xl font-extrabold text-gray-900">
                                                    <AnimatedNumber endValue={pkg.price} />
                                                </span>
                                                <span className="ml-1 text-base font-medium text-gray-500">{pkg.priceUnit}{pkg.priceSuffix}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8 flex-grow">
                                        {pkg.features.slice(0, 5).map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start space-x-3">
                                                <span className={`material-symbols-outlined mt-0.5 text-lg flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                                                    {feature.included ? 'check_circle' : 'close'}
                                                </span>
                                                <span className={`${!feature.included ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (pkg.ctaText === 'Pilih Paket' || pkg.ctaText === 'Go Global') {
                                                    setCurrentView(View.PaymentMembership);
                                                } else {
                                                    setCurrentView(View.Login);
                                                }
                                            }}
                                            className={ctaButtonClasses}
                                        >
                                            {pkg.ctaText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Siap Menjadi Bagian dari Transformasi Digital?</h2>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto">Daftarkan diri Anda atau usaha Anda sekarang dan nikmati berbagai fasilitas untuk berkembang bersama komunitas digital Tangerang Selatan.</p>
            <button onClick={() => setCurrentView(View.Login)} className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition duration-300 text-lg transform hover:scale-105 shadow-lg">
                Daftar Sekarang
            </button>
        </div>
      </section>
    </div>
  );
};

export default Home;