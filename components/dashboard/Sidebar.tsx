import React from 'react';
import { DashboardView, View, UserRole } from '../../types';
import { DASHBOARD_NAV_LINKS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  setCurrentView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, setCurrentView, isSidebarOpen, setIsSidebarOpen, role }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView(View.Home);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  // Filter menu sesuai role aktif agar daftar navigasi mengikuti desain.
  const availableLinks = DASHBOARD_NAV_LINKS.filter(link => role && link.roles.includes(role));
  
  // Group links by category
  const groupedLinks = {
    main: availableLinks.filter(link => !link.label.includes('Manajemen') || link.label === 'Manajemen UMKM'),
    admin: availableLinks.filter(link => link.label.includes('Manajemen') && link.label !== 'Manajemen UMKM')
  };

  const NavItem: React.FC<{ link: typeof DASHBOARD_NAV_LINKS[0] }> = ({ link }) => {
    const isActive = activeView === link.view;
    
    const handleNavClick = () => {
      setActiveView(link.view);
      setIsSidebarOpen(false); // Close sidebar on mobile after navigation
    };
    
    return (
      <li>
        <button
          onClick={handleNavClick}
          className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="material-symbols-outlined mr-4">{link.icon}</span>
          <span className="font-medium">{link.label}</span>
        </button>
      </li>
    );
  };

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="px-3 py-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b cursor-pointer" onClick={() => setCurrentView(View.Home)}>
            <h2 className="text-lg font-bold text-gray-800">Kampung Digital</h2>
            <p className="text-xs text-gray-500">Dasbor Pengguna</p>
          </div>
          <nav className="flex-grow p-4 overflow-y-auto">
            {/* Main Navigation */}
            <ul className="space-y-2">
              {groupedLinks.main.map(link => (
                <NavItem key={link.view} link={link} />
              ))}
            </ul>
            
            {/* Admin Management Section */}
            {groupedLinks.admin.length > 0 && (
              <div className="mt-6">
                <SectionHeader title="Manajemen Admin" />
                <ul className="space-y-1 mt-2">
                  {groupedLinks.admin.map(link => (
                    <NavItem key={link.view} link={link} />
                  ))}
                </ul>
              </div>
            )}
          </nav>
          <div className="p-4 border-t">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView(View.Home)}
                  className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="material-symbols-outlined mr-4">home</span>
                  <span className="font-medium">Kembali ke Beranda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200"
                >
                  <span className="material-symbols-outlined mr-4">logout</span>
                  <span className="font-medium">Keluar</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;