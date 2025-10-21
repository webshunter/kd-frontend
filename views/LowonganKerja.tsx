import React, { useState, useMemo, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import JobApplicationModal from '../components/dashboard/JobApplicationModal';
import { Job } from '../types';


// --- MOCK DATA ---
const MOCK_JOBS: Job[] = [
    {
        id: 1,
        title: 'Admin Media Sosial',
        company: 'Kopi Senja Tangsel',
        logo: 'https://picsum.photos/seed/kopi/100/100',
        location: 'Bintaro',
        type: 'Penuh Waktu',
        description: 'Mengelola semua akun media sosial Kopi Senja Tangsel, membuat konten yang menarik, dan berinteraksi dengan audiens untuk meningkatkan engagement dan brand awareness.',
        requirements: ['Pengalaman minimal 1 tahun sebagai admin media sosial.', 'Menguasai platform Instagram, TikTok, dan Facebook.', 'Kreatif dan memiliki kemampuan copywriting yang baik.', 'Memahami tren terkini di dunia kopi dan media sosial.'],
        salary: 'Rp 4.500.000 - Rp 5.500.000',
        postedDate: '2 hari lalu',
        companyDescription: 'Kopi Senja Tangsel adalah kedai kopi yang berfokus pada biji kopi asli Indonesia dengan suasana yang nyaman dan modern. Kami adalah tim kecil yang kreatif dan bersemangat untuk menyajikan kopi terbaik di Tangsel.',
        benefits: ['Lingkungan kerja yang santai & kreatif', 'Gratis kopi setiap hari', 'Jam kerja fleksibel', 'Bonus kinerja'],
    },
    {
        id: 2,
        title: 'Staf Dapur & Juru Masak',
        company: 'Bakso Mas Bejo',
        logo: 'https://picsum.photos/seed/bakso/100/100',
        location: 'Pamulang',
        type: 'Penuh Waktu',
        description: 'Membantu persiapan bahan baku, memasak sesuai resep standar, dan menjaga kebersihan area dapur. Bekerja dalam tim untuk memastikan kualitas dan kecepatan penyajian.',
        requirements: ['Memiliki passion di bidang kuliner.', 'Jujur, rajin, dan mampu bekerja dalam tim.', 'Pengalaman di dapur menjadi nilai tambah.', 'Bersedia bekerja dalam sistem shift.'],
        postedDate: '5 hari lalu',
        companyDescription: 'Warung Bakso Mas Bejo telah berdiri sejak tahun 2010 dan menjadi salah satu destinasi kuliner favorit di Pamulang. Kami mengutamakan kualitas bahan baku dan suasana kerja yang kekeluargaan.',
        benefits: ['Makan ditanggung', 'Bonus kerajinan', 'Tunjangan Hari Raya (THR)'],
    },
    {
        id: 3,
        title: 'Desainer Grafis Magang',
        company: 'Creative Woodcraft',
        logo: 'https://picsum.photos/seed/wood/100/100',
        location: 'Serpong',
        type: 'Magang',
        description: 'Membantu tim kreatif dalam membuat desain untuk kebutuhan promosi, konten media sosial, dan materi branding. Kesempatan untuk belajar langsung dari praktisi industri kreatif.',
        requirements: ['Mahasiswa tingkat akhir jurusan DKV atau setara.', 'Menguasai Adobe Photoshop, Illustrator, atau Canva.', 'Memiliki portofolio desain yang menarik.', 'Kreatif dan mau belajar hal baru.'],
        salary: 'Uang Saku',
        postedDate: '1 hari lalu',
        companyDescription: 'Creative Woodcraft adalah studio kriya yang berfokus pada produk-produk fungsional dari kayu daur ulang. Kami percaya pada keberlanjutan dan kreativitas tanpa batas.',
        benefits: ['Sertifikat magang', 'Jam kerja fleksibel', 'Lingkungan kerja kolaboratif', 'Peluang direkrut menjadi karyawan tetap'],
    },
    {
        id: 4,
        title: 'Asisten Butik',
        company: 'Anggrek Cantik Boutique',
        logo: 'https://picsum.photos/seed/anggrek/100/100',
        location: 'Bintaro',
        type: 'Paruh Waktu',
        description: 'Melayani pelanggan dengan ramah, membantu dalam penataan display butik, dan mengelola stok barang. Cocok untuk mahasiswa atau yang mencari kerja sampingan.',
        requirements: ['Berpenampilan menarik dan komunikatif.', 'Tertarik dengan dunia fashion.', 'Jujur dan bertanggung jawab.', 'Bersedia bekerja di akhir pekan.'],
        postedDate: '1 minggu lalu',
        companyDescription: 'Anggrek Cantik Boutique adalah destinasi fashion batik modern di Bintaro. Kami menyediakan produk-produk pilihan dengan kualitas terbaik untuk wanita modern Indonesia.',
        benefits: ['Diskon karyawan', 'Komisi penjualan', 'Suasana kerja yang nyaman'],
    },
];

const JOB_TYPES = ['Semua Jenis', 'Penuh Waktu', 'Paruh Waktu', 'Kontrak', 'Magang'];
const LOCATIONS = ['Semua Lokasi', 'Serpong', 'Ciputat', 'Pamulang', 'Bintaro', 'BSD', 'Lainnya'];

// --- CHILD COMPONENTS ---

const JobDetailModal: React.FC<{ job: Job | null; onClose: () => void; onApply: (job: Job) => void; }> = ({ job, onClose, onApply }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-detail-title"
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Tutup detail lowongan"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 bg-white/70 rounded-full p-1"
                >
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>

                <div className="p-6 md:p-8">
                    <div className="flex items-start space-x-4 mb-6">
                        <img src={job.logo} alt={`${job.company} logo`} className="w-16 h-16 rounded-lg object-contain border" />
                        <div>
                            <h2 id="job-detail-title" className="text-2xl md:text-3xl font-bold text-gray-800">{job.title}</h2>
                            <p className="text-lg text-gray-600">{job.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center"><span className="material-symbols-outlined !text-base mr-1">location_on</span>{job.location}</span>
                                <span className="flex items-center"><span className="material-symbols-outlined !text-base mr-1">schedule</span>{job.type}</span>
                            </div>
                        </div>
                    </div>

                    {job.salary && (
                         <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-bold text-green-800">Estimasi Gaji</h3>
                            <p className="text-lg font-semibold text-green-700">{job.salary}</p>
                        </div>
                    )}
                   

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Deskripsi Pekerjaan</h3>
                        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                    </div>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Tentang Perusahaan</h3>
                        <p className="text-gray-600 mb-4 text-sm">{job.companyDescription}</p>

                        <h4 className="font-semibold text-gray-700 mb-2">Benefit yang Ditawarkan</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            {job.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="material-symbols-outlined text-green-500 !text-base mr-2 mt-0.5">check_circle</span>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Kualifikasi</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {job.requirements.map((req, index) => <li key={index}>{req}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="p-4 md:p-6 bg-gray-50 border-t sticky bottom-0">
                    <button 
                        onClick={() => onApply(job)}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                         <span className="material-symbols-outlined">send</span>
                        <span>Lamar Sekarang</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const JobCard: React.FC<{ job: Job; onSelect: (job: Job) => void }> = ({ job, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="p-5">
            <div className="flex items-start space-x-4">
                <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-lg object-contain border" />
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center"><span className="material-symbols-outlined !text-base mr-1">location_on</span>{job.location}</span>
                <span className="flex items-center"><span className="material-symbols-outlined !text-base mr-1">schedule</span>{job.type}</span>
            </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">Diposting: {job.postedDate}</p>
            <button onClick={() => onSelect(job)} className="font-semibold text-blue-600 hover:text-blue-800 text-sm">
                Lihat Detail
            </button>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const LowonganKerja: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('Semua Jenis');
    const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [jobToApply, setJobToApply] = useState<Job | null>(null);

    const filteredJobs = useMemo(() => {
        return MOCK_JOBS.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  job.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'Semua Jenis' || job.type === selectedType;
            const matchesLocation = selectedLocation === 'Semua Lokasi' || job.location === selectedLocation;
            return matchesSearch && matchesType && matchesLocation;
        });
    }, [searchQuery, selectedType, selectedLocation]);

    useEffect(() => {
        // Manage body scroll when any modal is open
        if (selectedJob || jobToApply) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup function
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedJob, jobToApply]);


    const handleSelectJob = (job: Job) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setJobToApply(null);
    };

    const handleApply = (job: Job) => {
        setSelectedJob(null); // Close detail modal
        setJobToApply(job); // Open application modal
    };
    
    const SelectFilter: React.FC<{ label: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: string }> = ({ label, value, options, onChange, icon }) => (
        <div className="relative">
            <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
            <select aria-label={label} value={value} onChange={onChange} className="pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <span className="material-symbols-outlined text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
        </div>
    );

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <SectionTitle 
        title="Lowongan Kerja di Tangerang Selatan"
        subtitle="Temukan peluang karir terbaik dari UMKM dan perusahaan lokal."
      />

        {/* Filter Bar */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <div className="md:col-span-1 relative">
                    <label htmlFor="job-search" className="sr-only">Cari jabatan atau perusahaan</label>
                    <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
                    <input
                        type="text"
                        id="job-search"
                        placeholder="Cari jabatan atau perusahaan..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <SelectFilter label="Jenis Pekerjaan" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} options={JOB_TYPES} icon="work" />
                <SelectFilter label="Lokasi" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} options={LOCATIONS} icon="location_on" />
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-4 sm:mb-0">
                Menampilkan <span className="font-bold text-gray-800">{filteredJobs.length}</span> dari <span className="font-bold text-gray-800">{MOCK_JOBS.length}</span> lowongan
            </p>
             <button className="bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2">
                <span className="material-symbols-outlined">add</span>
                <span>Pasang Lowongan</span>
            </button>
        </div>

      {/* Job Listings */}
      {filteredJobs.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => <JobCard key={job.id} job={job} onSelect={handleSelectJob} />)}
         </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border">
            <span className="material-symbols-outlined text-6xl text-gray-400">search_off</span>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Lowongan Tidak Ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba ubah kata kunci pencarian atau filter Anda.</p>
        </div>
      )}

      <JobDetailModal job={selectedJob} onClose={handleCloseModal} onApply={handleApply} />
      <JobApplicationModal job={jobToApply} onClose={handleCloseModal} />
    </div>
  );
};

export default LowonganKerja;
