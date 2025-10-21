import React, { useState, useMemo } from 'react';
import SectionTitle from '../components/SectionTitle';

// --- TYPES ---
interface BusinessProfile {
  id: number;
  companyName: string;
  logo: string;
  category: 'Kuliner' | 'Fashion' | 'Jasa' | 'Kreatif' | 'Lainnya';
  tagline: string;
  lookingFor: string[];
  offering: string[];
  fullDescription: string;
  contactPerson: string;
  contactEmail: string;
}

// --- MOCK DATA ---
const MOCK_PROFILES: BusinessProfile[] = [
  {
    id: 1,
    companyName: 'Bakso Mas Bejo',
    logo: 'https://picsum.photos/seed/bakso/100/100',
    category: 'Kuliner',
    tagline: 'Pionir bakso urat dengan resep warisan keluarga.',
    lookingFor: ['Pemasok Daging Sapi', 'Distributor Makanan Beku', 'Mitra Franchise'],
    offering: ['Produk Bakso Beku', 'Peluang Franchise', 'Pelatihan Standar Dapur'],
    fullDescription: 'Kami mencari pemasok daging sapi berkualitas tinggi dengan kapasitas suplai minimal 50kg per minggu. Kami juga membuka peluang kemitraan franchise untuk area Jabodetabek bagi Anda yang ingin memulai bisnis kuliner dengan merek yang sudah dikenal.',
    contactPerson: 'Bejo Sutrisno',
    contactEmail: 'bejo.sutrisno@example.com',
  },
  {
    id: 2,
    companyName: 'Creative Woodcraft',
    logo: 'https://picsum.photos/seed/wood/100/100',
    category: 'Kreatif',
    tagline: 'Kerajinan tangan unik dari kayu daur ulang.',
    lookingFor: ['Toko Furnitur & Dekorasi', 'Distributor Produk Kriya', 'Corporate Gifting Partner'],
    offering: ['Jasa Produksi Souvenir Kustom', 'Kerajinan Kayu Unik', 'Workshop Keterampilan Kayu'],
    fullDescription: 'Creative Woodcraft menawarkan jasa pembuatan souvenir perusahaan dari bahan kayu berkualitas. Kami juga mencari mitra toko (offline maupun online) untuk menjadi reseller produk-produk kerajinan kami di seluruh Indonesia.',
    contactPerson: 'Joko Anwar',
    contactEmail: 'joko.anwar@example.com',
  },
  {
    id: 3,
    companyName: 'Anggrek Cantik Boutique',
    logo: 'https://picsum.photos/seed/anggrek/100/100',
    category: 'Fashion',
    tagline: 'Koleksi batik modern premium yang didesain eksklusif.',
    lookingFor: ['Pengrajin Batik Tulis', 'Pemasok Aksesoris Fashion', 'Fotografer Produk'],
    offering: ['Peluang Reseller & Dropship', 'Jasa Desain Fashion', 'Stok Pakaian Batik Modern'],
    fullDescription: 'Kami mencari pengrajin batik tulis lokal di area Tangsel dan sekitarnya untuk kolaborasi koleksi eksklusif. Selain itu, kami membuka program reseller dan dropship untuk para pegiat fashion yang ingin menjual produk kami.',
    contactPerson: 'Lestari Indah',
    contactEmail: 'lestari.indah@example.com',
  },
  {
    id: 4,
    companyName: 'Cuci Sepatu Kinclong',
    logo: 'https://picsum.photos/seed/sepatu/100/100',
    category: 'Jasa',
    tagline: 'Jasa cuci dan perawatan sepatu premium.',
    lookingFor: ['Pemasok Sabun & Peralatan Laundry', 'Mitra Titik Pengambilan (Drop Point)'],
    offering: ['Jasa Perawatan Sepatu Premium', 'Program Kemitraan Usaha', 'Pelatihan Cuci Sepatu'],
    fullDescription: 'Untuk memperluas jangkauan, kami mencari mitra seperti kafe, co-working space, atau toko di area strategis untuk menjadi drop point resmi kami. Kami menawarkan sistem bagi hasil yang menarik.',
    contactPerson: 'Agus Setiawan',
    contactEmail: 'agus.setiawan@example.com',
  },
];

const CATEGORIES = ['Semua Kategori', 'Kuliner', 'Fashion', 'Jasa', 'Kreatif', 'Lainnya'];
const LOOKING_FOR_OPTIONS = ['Semua Kebutuhan', 'Pemasok Daging Sapi', 'Distributor Makanan Beku', 'Mitra Franchise', 'Toko Furnitur & Dekorasi', 'Distributor Produk Kriya', 'Corporate Gifting Partner', 'Pengrajin Batik Tulis', 'Pemasok Aksesoris Fashion', 'Fotografer Produk', 'Pemasok Sabun & Peralatan Laundry', 'Mitra Titik Pengambilan (Drop Point)'];
const OFFERING_OPTIONS = ['Semua Penawaran', 'Produk Bakso Beku', 'Peluang Franchise', 'Pelatihan Standar Dapur', 'Jasa Produksi Souvenir Kustom', 'Kerajinan Kayu Unik', 'Workshop Keterampilan Kayu', 'Peluang Reseller & Dropship', 'Jasa Desain Fashion', 'Stok Pakaian Batik Modern', 'Jasa Perawatan Sepatu Premium', 'Program Kemitraan Usaha', 'Pelatihan Cuci Sepatu'];

// --- CHILD COMPONENTS ---

const ProfileDetailModal: React.FC<{ profile: BusinessProfile | null; onClose: () => void }> = ({ profile, onClose }) => {
    if (!profile) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Tutup detail profil"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 bg-white/70 rounded-full p-1"
                >
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>

                <div className="p-6 md:p-8">
                    <div className="flex items-start space-x-4 mb-6">
                        <img src={profile.logo} alt={`${profile.companyName} logo`} className="w-16 h-16 rounded-lg object-contain border" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{profile.companyName}</h2>
                            <p className="text-lg text-gray-600 italic">"{profile.tagline}"</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 border-b pb-2">Deskripsi Peluang</h3>
                        <p className="text-gray-600 whitespace-pre-line">{profile.fullDescription}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                             <h3 className="font-bold text-blue-800 mb-2 flex items-center"><span className="material-symbols-outlined mr-2">search</span>Looking For</h3>
                             <div className="flex flex-wrap gap-2">
                                {profile.lookingFor.map(item => <span key={item} className="text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{item}</span>)}
                             </div>
                        </div>
                         <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                             <h3 className="font-bold text-green-800 mb-2 flex items-center"><span className="material-symbols-outlined mr-2">local_offer</span>Offering</h3>
                             <div className="flex flex-wrap gap-2">
                                {profile.offering.map(item => <span key={item} className="text-xs font-semibold bg-green-200 text-green-800 px-2 py-1 rounded-full">{item}</span>)}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 bg-gray-50 border-t sticky bottom-0">
                    <button className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                         <span className="material-symbols-outlined">send</span>
                        <span>Kirim Permintaan Koneksi</span>
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">Permintaan Anda akan dikirim ke {profile.contactPerson} ({profile.contactEmail})</p>
                </div>
            </div>
        </div>
    );
};


const ProfileCard: React.FC<{ profile: BusinessProfile; onSelect: (profile: BusinessProfile) => void }> = ({ profile, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group border flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
        <div className="p-5 flex-grow">
            <div className="flex items-start space-x-4 mb-4">
                <img src={profile.logo} alt={`${profile.companyName} logo`} className="w-14 h-14 rounded-lg object-contain border" />
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{profile.companyName}</h3>
                    <p className="text-sm text-gray-500">{profile.category}</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 italic h-12">"{profile.tagline}"</p>
            
            <div className="mt-4 space-y-3 text-sm">
                <div>
                    <h4 className="font-semibold text-blue-700 text-xs uppercase flex items-center"><span className="material-symbols-outlined !text-sm mr-1">search</span>Looking For</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {profile.lookingFor.slice(0, 2).map(item => <span key={item} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{item}</span>)}
                        {profile.lookingFor.length > 2 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">+{profile.lookingFor.length - 2} lagi</span>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-green-700 text-xs uppercase flex items-center"><span className="material-symbols-outlined !text-sm mr-1">local_offer</span>Offering</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {profile.offering.slice(0, 2).map(item => <span key={item} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{item}</span>)}
                        {profile.offering.length > 2 && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+{profile.offering.length - 2} lagi</span>}
                    </div>
                </div>
            </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t">
            <button onClick={() => onSelect(profile)} className="w-full font-bold text-blue-600 hover:text-blue-800 text-sm bg-blue-100 hover:bg-blue-200 py-2 rounded-full transition-colors">
                Lihat Peluang & Hubungi
            </button>
        </div>
    </div>
);


const BusinessMatching: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
    const [selectedLookingFor, setSelectedLookingFor] = useState('Semua Kebutuhan');
    const [selectedOffering, setSelectedOffering] = useState('Semua Penawaran');
    const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);

    const filteredProfiles = useMemo(() => {
        return MOCK_PROFILES.filter(profile => {
            const matchesSearch = profile.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  profile.tagline.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'Semua Kategori' || profile.category === selectedCategory;
            const matchesLookingFor = selectedLookingFor === 'Semua Kebutuhan' || profile.lookingFor.includes(selectedLookingFor);
            const matchesOffering = selectedOffering === 'Semua Penawaran' || profile.offering.includes(selectedOffering);
            
            return matchesSearch && matchesCategory && matchesLookingFor && matchesOffering;
        });
    }, [searchQuery, selectedCategory, selectedLookingFor, selectedOffering]);
    
     const handleSelectProfile = (profile: BusinessProfile) => {
        setSelectedProfile(profile);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setSelectedProfile(null);
        document.body.style.overflow = 'auto';
    };

    const SelectFilter: React.FC<{ value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: string }> = ({ value, options, onChange, icon }) => (
        <div className="relative w-full">
            <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
            <select value={value} onChange={onChange} className="pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <span className="material-symbols-outlined text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle
                title="Pusat Kemitraan Bisnis"
                subtitle="Temukan mitra strategis, pemasok, distributor, atau peluang kolaborasi untuk mengakselerasi pertumbuhan usaha Anda."
            />
            
            <div className="text-center mb-12">
                <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 text-lg transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto">
                    <span className="material-symbols-outlined">add_business</span>
                    <span>Pasang Profil Peluang Anda</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <div className="lg:col-span-4 relative">
                        <label htmlFor="business-search" className="sr-only">Cari nama perusahaan atau kata kunci</label>
                        <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
                        <input
                            type="text"
                            id="business-search"
                            placeholder="Cari nama perusahaan atau kata kunci..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <SelectFilter value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} options={CATEGORIES} icon="category" />
                    <SelectFilter value={selectedLookingFor} onChange={(e) => setSelectedLookingFor(e.target.value)} options={LOOKING_FOR_OPTIONS} icon="search" />
                    <SelectFilter value={selectedOffering} onChange={(e) => setSelectedOffering(e.target.value)} options={OFFERING_OPTIONS} icon="local_offer" />
                </div>
            </div>

            {/* Listings */}
            {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProfiles.map(profile => <ProfileCard key={profile.id} profile={profile} onSelect={handleSelectProfile} />)}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border">
                    <span className="material-symbols-outlined text-6xl text-gray-400">person_search</span>
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">Mitra Tidak Ditemukan</h3>
                    <p className="text-gray-500 mt-2">Coba sesuaikan filter pencarian Anda untuk menemukan peluang yang cocok.</p>
                </div>
            )}

            <ProfileDetailModal profile={selectedProfile} onClose={handleCloseModal} />
        </div>
    );
};

export default BusinessMatching;