import React from 'react';
import { View } from '../types';
import SectionTitle from '../components/SectionTitle';

interface PemkotProps {
  setCurrentView: (view: View) => void;
}

const ServiceCard: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border">
        <div className="p-4 rounded-full bg-blue-100 mb-4 text-blue-500">
            <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);


const Pemkot: React.FC<PemkotProps> = ({ setCurrentView }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-28 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1600/500?random=28')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Pemerintah Kota Tangerang Selatan
          </h1>
          <p className="text-lg md:text-xl font-light mt-4 max-w-3xl mx-auto">
            Mewujudkan Kota Cerdas, Modern, dan Religius yang Berdaya Saing.
          </p>
        </div>
      </section>

       {/* Mayor's Welcome */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/3 text-center">
                    <img src="https://picsum.photos/seed/mayor/400/400" alt="Walikota Tangerang Selatan" className="w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto object-cover shadow-2xl ring-4 ring-offset-4 ring-blue-500"/>
                    <h3 className="text-2xl font-bold mt-6 text-gray-800">Drs. H. Benyamin Davnie</h3>
                    <p className="text-gray-500">Walikota Tangerang Selatan</p>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Sambutan Walikota</h2>
                    <blockquote className="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-6 py-2">
                       "Selamat datang di portal digital kami. Melalui platform Kampung Digital ini, kami berkomitmen untuk terus berinovasi dalam memberikan pelayanan terbaik bagi seluruh masyarakat Tangerang Selatan. Mari kita bersama-sama berkolaborasi membangun kota yang kita cintai ini menjadi lebih maju, sejahtera, dan berdaya saing di era digital."
                    </blockquote>
                </div>
            </div>
        </div>
      </section>
      
      {/* Visi Misi */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <SectionTitle title="Visi & Misi Kota" subtitle="Arah dan tujuan pembangunan Tangerang Selatan untuk masa depan yang lebih baik."/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><span className="material-symbols-outlined text-blue-500 mr-3">visibility</span>Visi</h3>
                    <p className="text-gray-600">Terwujudnya Tangerang Selatan sebagai Kota Cerdas, Berkualitas, dan Berdaya Saing Berbasis Teknologi dan Inovasi.</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><span className="material-symbols-outlined text-blue-500 mr-3">rocket_launch</span>Misi</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Mengembangkan sumber daya manusia yang handal dan berdaya saing.</li>
                        <li>Meningkatkan tata kelola pemerintahan yang baik.</li>
                        <li>Membangun perekonomian daerah yang kokoh.</li>
                        <li>Meningkatkan kualitas sarana dan prasarana kota.</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Layanan Unggulan Pemkot"
            subtitle="Akses berbagai layanan publik Pemerintah Kota Tangerang Selatan dengan lebih mudah."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard icon="groups" title="Layanan Kependudukan" description="Pengurusan KTP, Kartu Keluarga, Akta Kelahiran, dan dokumen kependudukan lainnya."/>
            <ServiceCard icon="description" title="Perizinan Online" description="Sistem perizinan terpadu untuk usaha, IMB, dan berbagai jenis izin lainnya secara online."/>
            <ServiceCard icon="health_and_safety" title="Kesehatan Masyarakat" description="Informasi fasilitas kesehatan, program Posyandu, dan layanan kesehatan publik."/>
            <ServiceCard icon="school" title="Pendidikan & Beasiswa" description="Informasi seputar sekolah, PPDB online, dan program beasiswa untuk pelajar berprestasi."/>
          </div>
           <div className="text-center mt-16">
                <a href="https://www.tangerangselatankota.go.id/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition duration-300 text-lg inline-flex items-center space-x-2">
                    <span>Kunjungi Situs Resmi Pemkot Tangsel</span>
                    <span className="material-symbols-outlined">open_in_new</span>
                </a>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Pemkot;