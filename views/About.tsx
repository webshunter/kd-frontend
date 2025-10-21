import React from 'react';
import { View } from '../types';
import SectionTitle from '../components/SectionTitle';

interface AboutProps {
  setCurrentView: (view: View) => void;
}

const InfoCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <span className="material-symbols-outlined text-3xl text-blue-600">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="text-gray-600 space-y-2">
      {children}
    </div>
  </div>
);

const About: React.FC<AboutProps> = ({ setCurrentView }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-28 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1600/500?grayscale&blur=1&random=4')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Tentang Kampung Digital Tangerang Selatan
          </h1>
          <p className="text-lg md:text-xl font-light mt-4 max-w-3xl mx-auto">
            Membangun Ekosistem Digital yang Cerdas, Inklusif, dan Kolaboratif untuk Kemajuan Bersama.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="Inisiatif Untuk Masa Depan Tangsel"
            subtitle="Kampung Digital Tangerang Selatan adalah sebuah platform ekosistem digital terpadu yang dirancang untuk memberdayakan warga, mengakselerasi pertumbuhan UMKM, dan meningkatkan kualitas layanan publik melalui pemanfaatan teknologi."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <InfoCard icon="rocket_launch" title="Misi Kami">
                <p>Meningkatkan literasi dan keterampilan digital masyarakat.</p>
                <p>Menciptakan ekosistem yang mendukung UMKM untuk naik kelas.</p>
                <p>Memfasilitasi kolaborasi antara pemerintah, warga, dan pelaku usaha.</p>
            </InfoCard>
            <InfoCard icon="visibility" title="Visi Kami">
                <p>Menjadikan Tangerang Selatan sebagai kota cerdas (smart city) yang berdaya saing, inovatif, dan sejahtera, dengan ekonomi digital yang kuat dan inklusif bagi seluruh lapisan masyarakat.</p>
            </InfoCard>
             <InfoCard icon="verified_user" title="Komitmen Pemkot">
                <p>Pemerintah Kota Tangerang Selatan berkomitmen penuh untuk mendukung transformasi digital. Inisiatif ini adalah wujud nyata dari upaya kami untuk menyediakan infrastruktur, regulasi, dan pendampingan yang dibutuhkan agar seluruh warga dapat merasakan manfaat dari ekonomi digital.</p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mari Berkolaborasi Membangun Tangsel</h2>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">Jadilah bagian dari gerakan ini. Daftarkan usaha Anda, ikuti pelatihan, atau berpartisipasi dalam forum untuk bersama-sama menciptakan masa depan yang lebih baik.</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <button onClick={() => setCurrentView(View.UMKM)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg">
                    Jelajahi Direktori UMKM
                </button>
                 <button onClick={() => setCurrentView(View.Login)} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 text-lg">
                    Daftar Sekarang
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;
