import React from 'react';
import { View } from '../types';

interface FooterProps {
  setCurrentView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {

  const NavButton: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
    <li>
      <button onClick={() => setCurrentView(view)} className="hover:text-white transition-colors duration-200">
        {children}
      </button>
    </li>
  );
  
  const SocialIcon: React.FC<{ href: string; children: React.ReactNode; label: string }> = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-gray-400 hover:text-white transition-colors duration-200">
      {children}
    </a>
  );

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div>
            <div className="mb-4 cursor-pointer" onClick={() => setCurrentView(View.Home)}>
              <h3 className="text-lg font-bold text-white">Kampung Digital</h3>
              <p className="text-sm text-gray-400 leading-tight">Tangerang Selatan</p>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Platform ekosistem digital untuk warga. Smart, Inklusif, Kolaboratif.
            </p>
            <div className="flex space-x-5 mb-6">
              <SocialIcon href="#" label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6.406-1.185a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter / X">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </SocialIcon>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                    <span className="material-symbols-outlined text-lg mr-3 mt-1 flex-shrink-0">location_on</span>
                    <span>Jl. Maruga Raya No.1, Serua, Kec. Ciputat, Kota Tangerang Selatan, Banten 15414</span>
                </li>
                 <li className="flex items-start">
                    <span className="material-symbols-outlined text-lg mr-3 mt-1 flex-shrink-0">mail</span>
                    <a href="mailto:kontak@kampungdigitaltangsel.id" className="hover:text-white">kontak@kampungdigitaltangsel.id</a>
                </li>
            </ul>
          </div>
          
          {/* Column 2: Ekosistem */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Ekosistem</h3>
            <ul className="space-y-2 text-gray-400">
              <NavButton view={View.UMKM}>Info UMKM</NavButton>
              <NavButton view={View.TangselMart}>TangselMart</NavButton>
              <NavButton view={View.GoodSkill}>GoodSkill</NavButton>
              <NavButton view={View.HalloHukum}>HalloHukum</NavButton>
              <NavButton view={View.Pendanaan}>Akses Pendanaan</NavButton>
              <NavButton view={View.Forum}>Forum One Tangsel</NavButton>
              <NavButton view={View.Mentoring}>Mentoring Bisnis</NavButton>
              <NavButton view={View.GoodEx}>GoodEx</NavButton>
            </ul>
          </div>

          {/* Column 3: Fitur Lainnya */}
          <div>
             <h3 className="text-lg font-bold text-white mb-4">Fitur Lainnya</h3>
            <ul className="space-y-2 text-gray-400">
              <NavButton view={View.Koperasi}>Koperasi Tangsel</NavButton>
              <NavButton view={View.LowonganKerja}>Lowongan Kerja</NavButton>
              <NavButton view={View.BusinessMatching}>Business Matching</NavButton>
              <NavButton view={View.DigitalMarketing}>Digital Marketing</NavButton>
              <NavButton view={View.EventTangsel}>Event Tangsel</NavButton>
            </ul>
          </div>
          
          {/* Column 4: Informasi */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Informasi</h3>
            <ul className="space-y-2 text-gray-400">
                <NavButton view={View.About}>Tentang Kami</NavButton>
                <NavButton view={View.Pemkot}>Pemkot Tangsel</NavButton>
                <NavButton view={View.Berita}>Berita & Kegiatan</NavButton>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kampung Digital Tangerang Selatan. Didukung oleh Pemkot Tangerang Selatan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;